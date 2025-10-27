// app/(admin)/beritas/actions.js
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

// Fungsi Create Berita
export async function createBerita(payload) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!payload.title || !payload.excerpt || !payload.content) {
    return { success: false, message: 'Judul, Kutipan, dan Konten wajib diisi.' };
  }

  try {
    const { data, error } = await supabase
      .from('berita')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Create Berita error:", error);
      return { success: false, message: `Gagal menambah berita: ${error.message}` };
    }

    // === PERBAIKAN DI SINI ===
    revalidatePath('/beritas'); // Refresh halaman daftar admin
    // === AKHIR PERBAIKAN ===
    revalidatePath('/'); // Refresh halaman utama (untuk section berita terbaru)
    revalidatePath('/berita/[id]', 'layout'); // Revalidate halaman detail publik

    return { success: true, message: 'Berita baru berhasil dipublikasikan!', data };
  } catch (error) {
    console.error("Unexpected error in createBerita:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Update Berita
export async function updateBerita(id, payload) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!id || !payload.title || !payload.excerpt || !payload.content) {
    return { success: false, message: 'Data tidak valid.' };
  }

  try {
    const { data, error } = await supabase
      .from('berita')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update Berita error:", error);
      return { success: false, message: `Gagal memperbarui berita: ${error.message}` };
    }

    // === PERBAIKAN DI SINI ===
    revalidatePath('/beritas'); // Refresh halaman daftar admin
    revalidatePath(`/beritas/${id}/edit`); // Refresh halaman edit admin
    // === AKHIR PERBAIKAN ===
    revalidatePath('/');
    revalidatePath(`/berita/${id}`); // Revalidate halaman detail publik

    return { success: true, message: 'Berita berhasil diperbarui!', data };
  } catch (error) {
    console.error("Unexpected error in updateBerita:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Delete Berita
export async function deleteBerita(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!id) {
    return { success: false, message: 'ID berita tidak valid.' };
  }

  try {
    const { error } = await supabase
      .from('berita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete Berita error:", error);
      return { success: false, message: `Gagal menghapus berita: ${error.message}` };
    }

    // === PERBAIKAN DI SINI ===
    revalidatePath('/beritas'); // Refresh halaman daftar admin
    // === AKHIR PERBAIKAN ===
    revalidatePath('/');
    revalidatePath('/berita/[id]', 'layout'); 

    return { success: true, message: 'Berita berhasil dihapus!' };
  } catch (error) {
    console.error("Unexpected error in deleteBerita:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga.' };
  }
}