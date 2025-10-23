// app/(admin)/catalogs/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
// Kita akan pakai router.push() di komponen form, jadi redirect tidak perlu di sini

// Fungsi bantu untuk cek status admin (optional tapi direkomendasikan)
async function checkAdminStatus(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return !error && profile?.is_admin === true;
}

// Fungsi untuk membuat katalog baru
export async function createCatalog(payload) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // Cek otorisasi admin
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menambah katalog.' };
  }

  // Validasi input dasar
  if (!payload.title || !payload.unor_id || !payload.category_id || !payload.data_url) {
    return { success: false, message: 'Judul, UNOR, Kategori, dan URL API wajib diisi.' };
  }

  try {
    console.log("Mencoba insert ke datasets:", payload);
    const { data, error } = await supabase
      .from('datasets')
      .insert([payload]) // Masukkan data payload
      .select()
      .single(); // Ambil data yang baru dibuat

    if (error) {
      console.error("Supabase create catalog error:", error);
      return { success: false, message: `Gagal membuat katalog: ${error.message}` };
    }

    console.log("Insert berhasil:", data);
    revalidatePath('/catalogs'); // Refresh halaman daftar katalog
    // revalidatePath('/admin-dashboard'); // Refresh dashboard juga jika perlu

    return { success: true, message: 'Katalog baru berhasil ditambahkan!', data };

  } catch (error) {
     console.error("Unexpected error in createCatalog:", error);
     return { success: false, message: 'Terjadi kesalahan tidak terduga saat membuat katalog.' };
  }
}

// Fungsi untuk mengupdate katalog yang sudah ada
export async function updateCatalog(id, payload) {
   const cookieStore = cookies();
   const supabase = createServerActionClient({ cookies: () => cookieStore });

   // Cek otorisasi admin
   const isAdmin = await checkAdminStatus(supabase);
   if (!isAdmin) {
     return { success: false, message: 'Akses ditolak: Hanya admin yang bisa mengubah katalog.' };
   }

   // Validasi input dasar
   if (!id || !payload.title || !payload.unor_id || !payload.category_id || !payload.data_url) {
     return { success: false, message: 'ID, Judul, UNOR, Kategori, dan URL API wajib diisi.' };
   }

   try {
    console.log(`Mencoba update datasets (ID: ${id}):`, payload);
     const { data, error } = await supabase
       .from('datasets')
       .update(payload) // Update data payload
       .eq('id', id) // Berdasarkan ID
       .select()
       .single();

     if (error) {
       console.error("Supabase update catalog error:", error);
       return { success: false, message: `Gagal memperbarui katalog: ${error.message}` };
     }

     console.log("Update berhasil:", data);
     revalidatePath('/catalogs'); // Refresh halaman daftar
     revalidatePath(`/catalogs/${id}/edit`); // Refresh halaman edit ini
     // revalidatePath('/admin-dashboard');

     return { success: true, message: 'Katalog berhasil diperbarui!', data };

   } catch (error) {
      console.error("Unexpected error in updateCatalog:", error);
      return { success: false, message: 'Terjadi kesalahan tidak terduga saat memperbarui katalog.' };
   }
}

// Fungsi untuk menghapus katalog
export async function deleteCatalog(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

   // Cek otorisasi admin
   const isAdmin = await checkAdminStatus(supabase);
   if (!isAdmin) {
     return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menghapus katalog.' };
   }

  if (!id) {
     return { success: false, message: 'ID katalog tidak valid.' };
  }

  try {
    console.log(`Mencoba delete datasets (ID: ${id})`);
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete catalog error:", error);
      return { success: false, message: `Gagal menghapus katalog: ${error.message}` };
    }

    console.log("Delete berhasil.");
    revalidatePath('/catalogs'); // Refresh halaman daftar
    // revalidatePath('/admin-dashboard');
    return { success: true, message: 'Katalog berhasil dihapus!' };

  } catch (error) {
     console.error("Unexpected error in deleteCatalog:", error);
     return { success: false, message: 'Terjadi kesalahan tidak terduga saat menghapus katalog.' };
  }
}