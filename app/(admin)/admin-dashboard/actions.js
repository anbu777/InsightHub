// app/(admin)/admin-dashboard/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Fungsi bantu cek admin (tambahkan jika belum ada di file ini)
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

// Fungsi Update Status Permintaan (dengan Pengecekan Admin)
export async function updateRequestStatus(formData) {
  const cookieStore = cookies();
  // Gunakan factory function untuk cookies (best practice)
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // === TAMBAHAN PENTING: Cek Otorisasi Admin ===
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    console.warn("Unauthorized attempt to update request status.");
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa mengubah status.' };
  }
  // === AKHIR TAMBAHAN ===

  const id = formData.get('id');
  const status = formData.get('status');
  // Ambil response_link, handle jika kosong menjadi null
  const response_link = formData.get('response_link') || null;

  // Validasi input dasar
  if (!id || !status) {
      return { success: false, message: 'ID atau Status permintaan tidak valid.' };
  }
  // Pastikan status adalah salah satu dari nilai ENUM yang valid
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
       return { success: false, message: 'Nilai status tidak valid.' };
  }

  try {
    console.log(`Mencoba update data_requests (ID: ${id}):`, { status, response_link });
    const { error } = await supabase
      .from('data_requests')
      .update({
        status,
        response_link
      })
      .eq('id', id);

    if (error) {
      console.error("Supabase update request error:", error);
      return { success: false, message: `Gagal memperbarui permohonan: ${error.message}` };
    }

    console.log("Update request status berhasil.");
    // Memberitahu Next.js untuk mengambil ulang data di halaman dashboard
    revalidatePath('/admin-dashboard');
    // Jika Anda punya halaman detail permintaan, revalidate juga
    // revalidatePath(`/admin/requests/${id}`); 

    return { success: true, message: 'Status permohonan berhasil diperbarui!' };

  } catch (error) {
     console.error("Unexpected error in updateRequestStatus:", error);
     return { success: false, message: 'Terjadi kesalahan tidak terduga saat memperbarui status.' };
  }
}

// === FUNGSI BARU UNTUK HAPUS PERMINTAAN ===
export async function deleteRequest(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menghapus permintaan.' };
  }

  if (!id) {
    return { success: false, message: 'ID permintaan tidak valid.' };
  }

  try {
    console.log(`Mencoba delete data_requests (ID: ${id})`);
    const { error } = await supabase
      .from('data_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete request error:", error);
      return { success: false, message: `Gagal menghapus permohonan: ${error.message}` };
    }

    console.log("Delete request berhasil.");
    revalidatePath('/admin-dashboard'); // Refresh dashboard
    return { success: true, message: 'Permohonan berhasil dihapus!' };

  } catch (error) {
    console.error("Unexpected error in deleteRequest:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga saat menghapus permohonan.' };
  }
}


// === FUNGSI BARU UNTUK HAPUS FEEDBACK ===
export async function deleteFeedback(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa menghapus feedback.' };
  }

  if (!id) {
    return { success: false, message: 'ID feedback tidak valid.' };
  }

  try {
    console.log(`Mencoba delete feedback (ID: ${id})`);
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete feedback error:", error);
      return { success: false, message: `Gagal menghapus feedback: ${error.message}` };
    }

    console.log("Delete feedback berhasil.");
    revalidatePath('/admin-dashboard'); // Refresh dashboard
    return { success: true, message: 'Feedback berhasil dihapus!' };

  } catch (error) {
    console.error("Unexpected error in deleteFeedback:", error);
    return { success: false, message: 'Terjadi kesalahan tidak terduga saat menghapus feedback.' };
  }
}