// supabase/functions/process-csv-upload/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Papa from 'https://esm.sh/papaparse@5.3.0'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Edge Function 'process-csv-upload' dimuat (Versi Perbaikan 4 - Reload Schema).");

// Fungsi: Membersihkan nama file menjadi nama tabel yang aman (Dengan Timestamp Unik)
function sanitizeTableName(filename: string): string {
  let name = filename.replace(/\.csv$/i, ''); 
  name = name.toLowerCase().replace(/[^a-z0-9_]/g, '_'); 
  if (name.match(/^[0-9]/)) {
    name = `tbl_${name}`;
  }
  name = name.replace(/_{2,}/g, '_'); 
  name = name.slice(0, 50);
  const timestamp = Date.now();
  return `${name}_${timestamp}`;
}

// Fungsi: Membuat query CREATE TABLE (Mengabaikan 'id' dari CSV)
function createTableQuery(tableName: string, headers: string[]): string {
  const safeTableName = `public."${tableName}"`;
  
  const columns = headers
    .filter(h => h && h.trim() !== '') 
    .filter(h => h.trim().toLowerCase() !== 'id') // Abaikan kolom 'id'
    .map(h => `"${h.trim()}" text`) 
    .join(', ');

  const finalColumns = columns.length > 0 ? `, ${columns}` : '';
  return `CREATE TABLE ${safeTableName} (id bigserial PRIMARY KEY${finalColumns});`;
}

// Fungsi: Membersihkan data CSV (Mengabaikan 'id' dari CSV)
function cleanCsvData(data: any[], headers: string[]) {
  const validHeaders = headers
    .filter(h => h && h.trim() !== '')
    .filter(h => h.trim().toLowerCase() !== 'id'); 
  
  return data
    .filter(row => 
        validHeaders.length > 0 
            ? validHeaders.some(header => row[header] !== null && row[header] !== undefined && row[header] !== '')
            : (row.id !== null && row.id !== undefined && row.id !== '') 
    )
    .map(row => {
      const newRow: { [key: string]: string } = {}; 
      for (const header of validHeaders) { 
        newRow[header] = row[header] === null || row[header] === undefined ? '' : String(row[header]);
      }
      return newRow;
    });
}


// Server utama Edge Function
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request...");
    return new Response('ok', { headers: corsHeaders })
  }

  let tableName: string | null = null; 
  
  try {
    console.log("Menerima request baru...");
    const { filePath, title, description, unor_id, category_id, originalFileName } = await req.json();
    if (!filePath || !title || unor_id === undefined || category_id === undefined || !originalFileName || description === undefined) {
      throw new Error(`Data tidak lengkap: ${JSON.stringify({ filePath, title, unor_id, category_id, originalFileName, description })}`);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL'); 
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); 
    if (!supabaseUrl || !serviceKey) {
      throw new Error('SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak diatur.');
    }
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    console.log(`Mengunduh file dari storage: ${filePath}...`);
    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from('csv-uploads')
      .download(filePath);
    if (downloadError) throw downloadError;
    if (!fileBlob) throw new Error('Gagal mengunduh file dari storage.');
    const csvText = await fileBlob.text();
    console.log("File berhasil diunduh dan dibaca.");

    await supabaseAdmin.storage.from('csv-uploads').remove([filePath]);
    console.log("File sementara di storage berhasil dihapus.");

    let headers: string[] = [];
    let data: any[] = [];
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          headers = results.meta.fields as string[];
        }
        data = results.data as any[];
      },
      error: (err: any) => { 
        throw new Error(`Gagal mem-parsing CSV: ${err.message}`);
      }
    });

    if (headers.length === 0 || !headers.every(h => typeof h === 'string')) {
      throw new Error('CSV tidak memiliki header yang valid atau formatnya salah.');
    }
    console.log("CSV berhasil di-parse. Headers:", headers);

    tableName = sanitizeTableName(originalFileName);
    const createTableSql = createTableQuery(tableName, headers); 
    console.log(`Mencoba membuat tabel: ${tableName}...`);

    const { error: createTableError } = await supabaseAdmin.rpc('exec', { 
      sql_query: createTableSql 
    });
    if (createTableError) {
       console.error("Error saat RPC 'exec' (CREATE TABLE):", createTableError);
       throw new Error(`Gagal membuat tabel: ${createTableError.message}.`);
    }
    console.log("Tabel berhasil dibuat.");

    const rlsSql = `
      ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Public can read ${tableName}" ON public."${tableName}" FOR SELECT USING (true);
    `;
    const { error: rlsError } = await supabaseAdmin.rpc('exec', { sql_query: rlsSql });
    if (rlsError) {
        console.error("Error saat menerapkan RLS:", rlsError);
        throw new Error(`Tabel dibuat, tapi gagal menerapkan RLS: ${rlsError.message}`);
    }
    console.log(`RLS berhasil diterapkan ke tabel ${tableName}.`);
    
    // === PERBAIKAN: Paksa API Reload Schema Cache ===
    console.log("Memberi notifikasi ke PostgREST untuk reload schema...");
    const { error: notifyError } = await supabaseAdmin.rpc('exec', { 
      sql_query: "NOTIFY pgrst, 'reload schema';"
    });
    if (notifyError) {
        // Ini tidak fatal, tapi penting untuk dicatat
        console.error("Gagal memberi notifikasi reload schema:", notifyError);
    } else {
        console.log("Notifikasi reload schema terkirim.");
        // Beri jeda 1 detik untuk memberi waktu cache-nya refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // === AKHIR PERBAIKAN ===


    const cleanedData = cleanCsvData(data, headers); 
    if (cleanedData.length > 0) {
        console.log(`Mencoba memasukkan ${cleanedData.length} baris data...`);
        const CHUNK_SIZE = 500;
        for (let i = 0; i < cleanedData.length; i += CHUNK_SIZE) {
            const chunk = cleanedData.slice(i, i + CHUNK_SIZE);
            // Ini sekarang seharusnya berhasil karena cache sudah di-refresh
            const { error: insertError } = await supabaseAdmin
                .from(tableName)
                .insert(chunk);
            if (insertError) {
              console.error("Error saat bulk insert:", insertError);
              throw new Error(`Gagal memasukkan data: ${insertError.message}`);
            }
        }
        console.log("Data berhasil dimasukkan.");
    } else {
        console.log("Tidak ada data valid untuk dimasukkan.");
    }
    
    const apiUrl = `${supabaseUrl}/rest/v1/${tableName}?select=*`;
    console.log(`API URL dibuat: ${apiUrl}`);

    const validHeadersForMetadata = headers
        .filter(h => h && h.trim() !== '')
        .filter(h => h.trim().toLowerCase() !== 'id');

    const { data: newCatalog, error: catalogError } = await supabaseAdmin
      .from('datasets')
      .insert({
        title: title,
        description: description || null,
        unor_id: unor_id,
        category_id: category_id,
        data_url: apiUrl,
        sample_data: cleanedData.slice(0, 3), 
        metadata: { 
          sumber: `File CSV: ${originalFileName}`,
          nama_tabel_database: tableName,
          kolom: validHeadersForMetadata.map(h => ({ nama: h, tipe: 'text' })) 
        }
      })
      .select()
      .single();
    
    if (catalogError) {
      console.error("Error saat insert ke 'datasets':", catalogError);
      throw new Error(`Gagal mendaftarkan katalog: ${catalogError.message}`);
    }
    console.log("Entri katalog baru berhasil dibuat di tabel 'datasets'.");

    return new Response(JSON.stringify({ success: true, data: newCatalog }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err: unknown) { 
    console.error('Error dalam Edge Function:', err);
    
    // Rollback
    if (tableName && (err as Error).message.includes("Gagal memasukkan data") || (err as Error).message.includes("Gagal menerapkan RLS")) {
        console.log(`Mencoba menghapus tabel ${tableName} karena proses insert/RLS gagal...`);
        const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
        await supabaseAdmin.rpc('exec', { sql_query: `DROP TABLE public."${tableName}";` });
        console.log(`Tabel ${tableName} berhasil dihapus.`);
    }

    const error = err as Error; 
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})