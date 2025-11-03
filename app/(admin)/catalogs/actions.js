// app/(admin)/catalogs/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Fungsi bantu cek admin
async function checkAdminStatus(supabase) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    return !error && profile?.is_admin === true;
  } catch(error) {
      console.error("Exception checking admin status:", error);
      return false;
  }
}

// Fungsi Inspeksi API Endpoint (Tidak Diubah)
export async function inspectApiEndpoint(urlToInspect) {
  console.log(`Menerima permintaan inspeksi untuk: ${urlToInspect}`);
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
  if (!urlToInspect || !urlToInspect.startsWith('http')) {
      return { success: false, message: 'URL tidak valid. Pastikan dimulai dengan http:// atau https://' };
  }
  try {
    // --- REVISI: Tambahkan Anon Key jika URL diinspeksi adalah URL Supabase internal ---
    let url = urlToInspect;
    const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (publicSupabaseUrl && publicAnonKey && 
        url.startsWith(publicSupabaseUrl) && 
        url.includes('/rest/v1/') && 
        !url.includes('apikey=')) 
    {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}apikey=${publicAnonKey}`;
        console.log("Inspeksi: Menambahkan apikey publik ke URL:", url);
    }
    // --- Akhir Revisi ---

    const response = await fetch(url, { // Menggunakan 'url' yang sudah direvisi
        method: 'GET',
        headers: { 
            'Accept': 'application/json', 
            'User-Agent': 'InsightHub-Inspector/1.0',
            // 'apikey': publicAnonKey // Alternatif jika header diperlukan
        }
    });
    if (!response.ok) throw new Error(`Gagal mengambil data: Server merespons dengan status ${response.status}`);
    const data = await response.json();
    console.log("Inspeksi: Data JSON berhasil diambil.");
    let dataArray = [];
    if (Array.isArray(data)) dataArray = data;
    else if (data.features && Array.isArray(data.features)) dataArray = data.features.map(f => f.properties || f);
    else if (data.records && Array.isArray(data.records)) dataArray = data.records;
    else if (data.data && Array.isArray(data.data)) dataArray = data.data;
    else if (data.attributes && Array.isArray(data.attributes)) dataArray = data.attributes.map(item => item.attributes || item);
    else throw new Error('Format JSON tidak dikenali.');
    if (dataArray.length === 0) throw new Error('API berhasil dipanggil, data kosong.');
    const sample_data = dataArray.slice(0, 3);
    const sample_data_string = JSON.stringify(sample_data, null, 2);
    const firstItem = sample_data[0] || {};
    const keys = Object.keys(firstItem);
    const metadata = { deskripsi_kolom: keys.map(key => ({ nama: key, tipe: typeof firstItem[key] })) };
    const metadata_string = JSON.stringify(metadata, null, 2);
    console.log("Inspeksi: Metadata (skema) diekstrak.");
    return { 
        success: true, 
        message: 'API berhasil diinspeksi! Form telah diisi.',
        data: { 
            data_url: urlToInspect, // Kembalikan URL asli yg diinput user
            sample_data_string, 
            metadata_string 
        }
    };
  } catch (error) {
    console.error("Error dalam inspectApiEndpoint:", error.message);
    return { success: false, message: error.message || 'Terjadi kesalahan.' };
  }
}

// Fungsi Upload CSV (Tidak Diubah, karena revisi di Edge Function sudah cukup)
export async function createCatalogFromCSV(formData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
  const title = formData.get('title');
  const description = formData.get('description') || '';
  const unor_id = formData.get('unor_id');
  const category_id = formData.get('category_id');
  const csvFile = formData.get('csv_file');
  if (!title || !unor_id || !category_id || !csvFile) {
    return { success: false, message: 'Judul, UNOR, Kategori, dan File CSV wajib diisi.' };
  }
  if (!(csvFile instanceof File) || csvFile.size === 0) {
     return { success: false, message: 'File CSV tidak valid atau kosong.' };
  }
  if (csvFile.type !== 'text/csv') {
     return { success: false, message: 'Format file tidak valid. Harap unggah file .csv' };
  }
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'admin';
  const safeFileName = `${userId}/${Date.now()}_${csvFile.name}`;
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('csv-uploads')
      .upload(safeFileName, csvFile);
    if (uploadError) throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
    console.log("File berhasil diunggah ke:", uploadData.path);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Konfigurasi server (URL/Service Key) tidak ditemukan.");
    }
    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log("Memanggil Edge Function 'process-csv-upload'...");
    const { data: functionData, error: functionError } = await supabaseService.functions.invoke('process-csv-upload', {
      body: { 
        filePath: uploadData.path,
        originalFileName: csvFile.name,
        title: title,
        description: description,
        unor_id: unor_id,
        category_id: category_id
      }
    });
    if (functionError) throw new Error(`Gagal memproses file: ${functionError.message}`);
    if (functionData.success === false) throw new Error(functionData.message);
    console.log("Edge Function berhasil, katalog dibuat:", functionData.data);
    revalidatePath('/catalogs');
    revalidatePath('/admin-dashboard');
    return { success: true, message: 'Katalog baru berhasil dibuat dari file CSV!', data: functionData.data };
  } catch (error) { 
     console.error("Unexpected error in createCatalogFromCSV:", error.message);
     if (safeFileName) {
        await supabase.storage.from('csv-uploads').remove([safeFileName]);
        console.log("File upload sementara dihapus setelah error.");
     }
     return { success: false, message: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}

// --- REVISI: Fungsi createCatalog (Manual/Inspeksi) ---
export async function createCatalog(payload) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
  if (!payload.title || !payload.unor_id || !payload.category_id || !payload.data_url) {
    return { success: false, message: 'Judul, UNOR, Kategori, dan URL API wajib diisi.' };
  }

  // REVISI: Pastikan URL yang disimpan adalah URL publik yang valid
  let finalDataUrl = payload.data_url;
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (publicSupabaseUrl && publicAnonKey && 
      finalDataUrl.startsWith(publicSupabaseUrl) && 
      finalDataUrl.includes('/rest/v1/') && 
      !finalDataUrl.includes('apikey=')) 
  {
      // URL adalah URL Supabase internal, tambahkan anon key agar jadi publik
      const separator = finalDataUrl.includes('?') ? '&' : '?';
      finalDataUrl = `${finalDataUrl}${separator}apikey=${publicAnonKey}`;
      console.log("createCatalog: Menambahkan apikey publik ke data_url:", finalDataUrl);
  }
  // --- Akhir Revisi ---
  
  // Buat payload baru dengan URL yang sudah final
  const finalPayload = {
    ...payload,
    data_url: finalDataUrl
  };

  try {
    console.log("Mencoba insert ke datasets:", finalPayload);
    const { data, error } = await supabase.from('datasets').insert([finalPayload]).select().single();
    if (error) {
      console.error("Supabase create catalog error:", error);
      return { success: false, message: `Gagal membuat katalog: ${error.message}` };
    }
    console.log("Insert berhasil:", data);
    revalidatePath('/catalogs');
    revalidatePath('/admin-dashboard');
    return { success: true, message: 'Katalog baru berhasil ditambahkan!', data };
  } catch (error) {
     console.error("Unexpected error in createCatalog:", error);
     return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}

// --- REVISI: Fungsi updateCatalog ---
export async function updateCatalog(id, payload) {
   const cookieStore = cookies();
   const supabase = createServerActionClient({ cookies: () => cookieStore });
   const isAdmin = await checkAdminStatus(supabase);
   if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
   if (!id || !payload.title || !payload.unor_id || !payload.category_id || !payload.data_url) {
     return { success: false, message: 'Data tidak valid.' };
   }

    // REVISI: Pastikan URL yang disimpan adalah URL publik yang valid
    let finalDataUrl = payload.data_url;
    const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (publicSupabaseUrl && publicAnonKey && 
        finalDataUrl.startsWith(publicSupabaseUrl) && 
        finalDataUrl.includes('/rest/v1/') && 
        !finalDataUrl.includes('apikey=')) 
    {
        const separator = finalDataUrl.includes('?') ? '&' : '?';
        finalDataUrl = `${finalDataUrl}${separator}apikey=${publicAnonKey}`;
        console.log("updateCatalog: Menambahkan apikey publik ke data_url:", finalDataUrl);
    }
    // --- Akhir Revisi ---
    
    // Buat payload baru dengan URL yang sudah final
    const finalPayload = {
      ...payload,
      data_url: finalDataUrl
    };

   try {
    console.log(`Mencoba update datasets (ID: ${id}):`, finalPayload);
     const { data, error } = await supabase.from('datasets').update(finalPayload).eq('id', id).select().single();
     if (error) {
       console.error("Supabase update catalog error:", error);
       return { success: false, message: `Gagal memperbarui katalog: ${error.message}` };
     }
     console.log("Update berhasil:", data);
     revalidatePath('/catalogs');
     revalidatePath(`/catalogs/${id}/edit`);
    revalidatePath('/admin-dashboard');
     return { success: true, message: 'Katalog berhasil diperbarui!', data };
   } catch (error) {
      console.error("Unexpected error in updateCatalog:", error);
      return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
   }
}


// === FUNGSI deleteCatalog (Tidak Diubah) ===
export async function deleteCatalog(id, tableName) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // 1. Cek Admin
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menghapus katalog.' };
  }

  // 2. Validasi Input
  if (!id) {
    return { success: false, message: 'ID katalog tidak valid.' };
  }

  // Kita perlu client dengan SERVICE_ROLE_KEY untuk memanggil RPC 'exec'
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY tidak diatur. Tidak dapat menghapus tabel fisik.");
      // Kita tetap lanjutkan untuk menghapus entri datasets
  }
  
  const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 3. Hapus Entri di 'datasets' (dilakukan terlebih dahulu)
    console.log(`Mencoba delete datasets (ID: ${id})`);
    const { error: deleteDatasetError } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);

    if (deleteDatasetError) {
      console.error("Supabase delete dataset error:", deleteDatasetError);
      return { success: false, message: `Gagal menghapus entri katalog: ${deleteDatasetError.message}` };
    }
    console.log("Delete dari 'datasets' berhasil.");

    // 4. Hapus Tabel Fisik (jika 'tableName' diberikan)
    if (tableName && typeof tableName === 'string' && tableName.trim() !== '') {
      // Validasi sederhana untuk mencegah SQL injection
      if (!/^[a-z0-9_]+$/.test(tableName)) {
          console.warn(`Nama tabel tidak valid (${tableName}), penghapusan tabel fisik dilewati.`);
          revalidatePath('/catalogs');
          revalidatePath('/admin-dashboard');
          return { success: true, message: `Katalog dihapus, tapi tabel fisik '${tableName}' tidak valid & dilewati.` };
      }

      console.log(`Mencoba menghapus tabel fisik: public."${tableName}"`);
      const { error: dropTableError } = await supabaseService.rpc('exec', {
        sql_query: `DROP TABLE IF EXISTS public."${tableName}";`
      });

      if (dropTableError) {
        console.error("Error saat RPC 'exec' (DROP TABLE):", dropTableError);
        // Jangan gagalkan seluruh operasi jika drop tabel gagal
        // Kembalikan sukses karena entri 'datasets' sudah terhapus
        return { success: true, message: `Katalog berhasil dihapus, tetapi tabel fisik '${tableName}' gagal dihapus.` };
      }
      console.log(`Tabel fisik '${tableName}' berhasil dihapus.`);
    } else {
      console.log("Tidak ada nama tabel fisik di metadata, penghapusan tabel dilewati.");
    }

    // 5. Sukses
    revalidatePath('/catalogs');
    revalidatePath('/admin-dashboard');
    return { success: true, message: 'Katalog dan data terkait berhasil dihapus!' };

  } catch (error) {
     console.error("Unexpected error in deleteCatalog:", error.message);
     return { success: false, message: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}