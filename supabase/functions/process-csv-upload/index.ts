// supabase/functions/process-csv-upload/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Papa from 'https://esm.sh/papaparse@5.3.0'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Edge Function 'process-csv-upload' dimuat.");

// === FUNGSI DIUBAH: Menambahkan Timestamp Unik ===
function sanitizeTableName(filename: string): string {
  let name = filename.replace(/\.csv$/i, ''); // Hapus ekstensi .csv
  name = name.toLowerCase().replace(/[^a-z0-9_]/g, '_'); // Ganti karakter non-alfanumerik
  if (name.match(/^[0-9]/)) { // Jika dimulai dengan angka
    name = `tbl_${name}`;
  }
  name = name.replace(/_{2,}/g, '_'); // Hapus _ berurutan
  name = name.slice(0, 50); // Potong di 50 char (sisakan ruang untuk timestamp)
  
  // TAMBAHKAN TIMESTAMP UNIK
  const timestamp = Date.now();
  return `${name}_${timestamp}`; // Hasil: aset_tanah_pu_1761807112683
}
// === AKHIR PERUBAHAN ===

// Fungsi: Membuat query CREATE TABLE (Tidak Diubah)
function createTableQuery(tableName: string, headers: string[]): string {
  const safeTableName = `public."${tableName}"`;
  const columns = headers
    .filter(h => h && h.trim() !== '') 
    .map(h => `"${h.trim()}" text`)
    .join(', ');

  if (columns.length === 0) {
    throw new Error('Header CSV tidak valid atau kosong.');
  }
  return `CREATE TABLE ${safeTableName} (id bigserial PRIMARY KEY, ${columns});`;
}

// Fungsi: Membersihkan data CSV (Tidak Diubah)
function cleanCsvData(data: any[], headers: string[]) {
  const validHeaders = headers.filter(h => h && h.trim() !== '');
  
  return data
    .filter(row => validHeaders.some(header => row[header] !== null && row[header] !== undefined && row[header] !== ''))
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

  try {
    console.log("Menerima request baru...");
    const { filePath, title, description, unor_id, category_id, originalFileName } = await req.json();
    if (!filePath || !title || !unor_id || !category_id || !originalFileName) {
      throw new Error('Data tidak lengkap: filePath, title, unor_id, category_id, dan originalFileName wajib diisi.');
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

    // Nama tabel sekarang akan selalu unik
    const tableName = sanitizeTableName(originalFileName); 
    const createTableSql = createTableQuery(tableName, headers);
    console.log(`Mencoba membuat tabel: ${tableName}...`);

    // Eksekusi query CREATE TABLE
    const { error: createTableError } = await supabaseAdmin.rpc('exec', { 
      sql_query: createTableSql 
    });
    // Error 'already exists' seharusnya tidak terjadi lagi
    if (createTableError) {
       console.error("Error saat RPC 'exec' (CREATE TABLE):", createTableError);
       throw new Error(`Gagal membuat tabel: ${createTableError.message}.`);
    }
    console.log("Tabel berhasil dibuat.");

    // === PERBAIKAN: Tambahkan RLS Policy ke Tabel Baru ===
    // Ini akan memperbaiki error 401 (Download CSV/JSON) di sisi user
    const rlsSql = `
      ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Public read access" ON public."${tableName}" FOR SELECT USING (true);
    `;
    const { error: rlsError } = await supabaseAdmin.rpc('exec', { sql_query: rlsSql });
    if (rlsError) {
        console.error("Error saat menerapkan RLS:", rlsError);
        throw new Error(`Tabel dibuat, tapi gagal menerapkan RLS: ${rlsError.message}`);
    }
    console.log(`RLS berhasil diterapkan ke tabel ${tableName}.`);
    // === AKHIR PERBAIKAN ===


    const cleanedData = cleanCsvData(data, headers);
    if (cleanedData.length > 0) {
        console.log(`Mencoba memasukkan ${cleanedData.length} baris data...`);
        const CHUNK_SIZE = 500;
        for (let i = 0; i < cleanedData.length; i += CHUNK_SIZE) {
            const chunk = cleanedData.slice(i, i + CHUNK_SIZE);
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
          kolom: headers.map(h => ({ nama: h, tipe: 'text' })) 
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
    const error = err as Error; 
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})