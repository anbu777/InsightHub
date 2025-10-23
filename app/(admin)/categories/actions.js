// app/(admin)/categories/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Fungsi bantu cek admin
async function checkAdminStatus(supabase) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
    return profile?.is_admin === true;
  } catch(error) {
      console.error("Exception checking admin status:", error);
      return false;
  }
}

// Fungsi Create Kategori
export async function createCategory(namaKategori) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menambah kategori.' };

  const trimmedName = namaKategori.trim();
  if (!trimmedName) {
    return { success: false, message: 'Nama Kategori tidak boleh kosong.' };
  }

  try {
    console.log("Mencoba insert ke categories:", { nama_kategori: trimmedName });
    const { data, error } = await supabase
      .from('categories')
      .insert([{ nama_kategori: trimmedName }])
      .select()
      .single();

    if (error) {
      console.error("Supabase create Category error:", error);
      // Handle potential duplicate name error more gracefully
      if (error.code === '23505') { // Unique constraint violation
          return { success: false, message: `Gagal: Kategori dengan nama "${trimmedName}" sudah ada.` };
      }
      return { success: false, message: `Gagal menambah Kategori: ${error.message}` };
    }

    console.log("Insert category berhasil:", data);
    revalidatePath('/categories'); // Refresh halaman daftar kategori
    revalidatePath('/catalogs/new'); // Refresh form katalog (agar kategori baru muncul)
    revalidatePath('/catalogs/[id]/edit', 'layout'); // Refresh form edit katalog

    return { success: true, message: 'Kategori baru berhasil ditambahkan!', data };
  } catch (error) {
    console.error("Unexpected error in createCategory:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga saat menambah kategori.' };
  }
}

// Fungsi Update Kategori
export async function updateCategory(id, namaKategori) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak: Hanya admin yang bisa mengubah kategori.' };

  const trimmedName = namaKategori.trim();
  if (!id || !trimmedName) {
    return { success: false, message: 'ID atau Nama Kategori tidak valid.' };
  }

  try {
    console.log(`Mencoba update categories (ID: ${id}):`, { nama_kategori: trimmedName });
    const { data, error } = await supabase
      .from('categories')
      .update({ nama_kategori: trimmedName })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update Category error:", error);
       if (error.code === '23505') { 
          return { success: false, message: `Gagal: Kategori dengan nama "${trimmedName}" sudah ada.` };
      }
      return { success: false, message: `Gagal memperbarui Kategori: ${error.message}` };
    }

    console.log("Update category berhasil:", data);
    revalidatePath('/categories');
    revalidatePath('/catalogs/new');
    revalidatePath('/catalogs/[id]/edit', 'layout');
    revalidatePath('/catalogs'); // Refresh daftar katalog juga

    return { success: true, message: 'Kategori berhasil diperbarui!', data };
  } catch (error) {
    console.error("Unexpected error in updateCategory:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga saat memperbarui kategori.' };
  }
}

// Fungsi Delete Kategori
export async function deleteCategory(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menghapus kategori.' };

  if (!id) {
    return { success: false, message: 'ID Kategori tidak valid.' };
  }

  try {
    // Periksa apakah Kategori masih digunakan di tabel datasets
    console.log(`Memeriksa penggunaan category_id: ${id} di tabel datasets...`);
    const { count, error: checkError } = await supabase
      .from('datasets')
      .select('id', { count: 'exact', head: true }) // Lebih efisien
      .eq('category_id', id);

    if (checkError) {
      console.error("Error checking Category usage:", checkError);
      return { success: false, message: 'Gagal memeriksa penggunaan Kategori.' };
    }

    console.log(`Jumlah katalog yang menggunakan kategori ini: ${count}`);
    if (count > 0) {
      return { success: false, message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${count} katalog data.` };
    }

    // Jika tidak digunakan, lanjutkan penghapusan
    console.log(`Mencoba delete categories (ID: ${id})`);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete Category error:", error);
      return { success: false, message: `Gagal menghapus Kategori: ${error.message}` };
    }

    console.log("Delete category berhasil.");
    revalidatePath('/categories');
    revalidatePath('/catalogs/new');
    revalidatePath('/catalogs/[id]/edit', 'layout');

    return { success: true, message: 'Kategori berhasil dihapus!' };
  } catch (error) {
    console.error("Unexpected error in deleteCategory:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga saat menghapus kategori.' };
  }
}