// app/(admin)/unors/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Fungsi bantu cek admin (sama seperti di catalogs/actions.js)
async function checkAdminStatus(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return !error && profile?.is_admin === true;
}

// Fungsi Create UNOR
export async function createUnor(namaUnor) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!namaUnor || typeof namaUnor !== 'string' || namaUnor.trim() === '') {
    return { success: false, message: 'Nama UNOR tidak valid.' };
  }

  try {
    const { data, error } = await supabase
      .from('unors')
      .insert([{ nama_unor: namaUnor.trim() }]) // Pastikan di-trim
      .select()
      .single();

    if (error) {
      console.error("Create UNOR error:", error);
      return { success: false, message: `Gagal menambah UNOR: ${error.message}` };
    }

    revalidatePath('/unors'); // Refresh halaman daftar
    revalidatePath('/catalogs/new'); // Refresh form katalog (agar UNOR baru muncul)
    revalidatePath('/catalogs/[id]/edit', 'layout'); // Refresh form edit katalog

    return { success: true, message: 'UNOR baru berhasil ditambahkan!', data };
  } catch (error) {
    console.error("Unexpected error in createUnor:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Update UNOR
export async function updateUnor(id, namaUnor) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!id || !namaUnor || typeof namaUnor !== 'string' || namaUnor.trim() === '') {
    return { success: false, message: 'Data UNOR tidak valid.' };
  }

  try {
    const { data, error } = await supabase
      .from('unors')
      .update({ nama_unor: namaUnor.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update UNOR error:", error);
      return { success: false, message: `Gagal memperbarui UNOR: ${error.message}` };
    }

    revalidatePath('/unors');
    revalidatePath('/catalogs/new');
    revalidatePath('/catalogs/[id]/edit', 'layout');
    revalidatePath('/catalogs'); // Refresh daftar katalog juga

    return { success: true, message: 'UNOR berhasil diperbarui!', data };
  } catch (error) {
    console.error("Unexpected error in updateUnor:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Delete UNOR
export async function deleteUnor(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!id) {
    return { success: false, message: 'ID UNOR tidak valid.' };
  }

  try {
    // Periksa apakah UNOR masih digunakan di tabel datasets
    const { count, error: checkError } = await supabase
      .from('datasets')
      .select('*', { count: 'exact', head: true })
      .eq('unor_id', id);

    if (checkError) {
      console.error("Error checking UNOR usage:", checkError);
      return { success: false, message: 'Gagal memeriksa penggunaan UNOR.' };
    }

    if (count > 0) {
      return { success: false, message: `UNOR tidak dapat dihapus karena masih digunakan oleh ${count} katalog data.` };
    }

    // Jika tidak digunakan, lanjutkan penghapusan
    const { error } = await supabase
      .from('unors')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete UNOR error:", error);
      return { success: false, message: `Gagal menghapus UNOR: ${error.message}` };
    }

    revalidatePath('/unors');
    revalidatePath('/catalogs/new');
    revalidatePath('/catalogs/[id]/edit', 'layout');

    return { success: true, message: 'UNOR berhasil dihapus!' };
  } catch (error) {
    console.error("Unexpected error in deleteUnor:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}