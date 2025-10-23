// app/(admin)/admin-dashboard/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
// BARU: Impor Resend
import { Resend } from 'resend';

// BARU: Inisialisasi Resend (pastikan RESEND_API_KEY ada di .env.local)
let resend;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
   console.log("Resend client initialized successfully (Admin Actions).");
} else {
  console.warn("PERINGATAN (Admin Actions): RESEND_API_KEY tidak ditemukan. Fitur notifikasi email tidak akan aktif.");
}

// Fungsi bantu cek admin (Tidak Diubah)
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

// Fungsi Update Status Permintaan (dengan Pengecekan Admin & Email)
export async function updateRequestStatus(formData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) {
    return { success: false, message: 'Akses ditolak: Hanya admin yang bisa mengubah status.' };
  }

  const id = formData.get('id');
  const status = formData.get('status');
  const response_link = formData.get('response_link')?.trim() || null; // Trim spasi & jadikan null jika kosong

  // Validasi input (Tidak Diubah)
  if (!id || !status) { return { success: false, message: 'ID atau Status permintaan tidak valid.' }; }
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) { return { success: false, message: 'Nilai status tidak valid.' }; }

  let userEmail = null; // Variabel untuk menyimpan email
  let userName = null;  // Variabel untuk menyimpan nama
  let requestedReason = null; // Variabel untuk menyimpan alasan
  let emailSentMessage = ''; // Pesan tambahan jika email gagal

  try {
    // 1. Ambil data email, nama, alasan dari request yang akan diupdate
    console.log(`Mencari data pemohon untuk request ID: ${id}`);
    const { data: requestData, error: fetchError } = await supabase
        .from('data_requests')
        .select('user_email, user_name, reason')
        .eq('id', id)
        .single();

    if (fetchError || !requestData) {
        console.error("Error fetching request data for email:", fetchError);
        console.warn("Gagal mendapatkan data pemohon, email notifikasi tidak akan dikirim.");
    } else {
        userEmail = requestData.user_email;
        userName = requestData.user_name;
        requestedReason = requestData.reason;
        console.log(`Data pemohon ditemukan: ${userName} (${userEmail})`);
    }

    // 2. Update status di Supabase
    console.log(`Mencoba update data_requests (ID: ${id}):`, { status, response_link });
    const { error: updateError } = await supabase
      .from('data_requests')
      .update({ status, response_link })
      .eq('id', id);

    if (updateError) {
      console.error("Supabase update request error:", updateError);
      return { success: false, message: `Gagal memperbarui permohonan: ${updateError.message}` };
    }

    console.log("Update request status berhasil di Supabase.");

    // === BAGIAN BARU: Kirim Email Notifikasi Status ===
    if (resend && userEmail && (status === 'approved' || status === 'rejected')) {
        let emailSubject = '';
        let emailHtml = '';
        const requestIdShort = id.substring(0, 6); // ID singkat untuk subjek

        if (status === 'approved') {
            emailSubject = `[Disetujui] Permintaan Data #${requestIdShort} - Insight Hub PUPR`;
            emailHtml = `
                 <div style="font-family: sans-serif; line-height: 1.6;">
                    <p>Halo ${userName || 'Pengguna'},</p>
                    <p>Kabar baik! Permintaan data Anda (ID: #${requestIdShort}) untuk:</p>
                    <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; color: #555;">
                       <p><em>"${requestedReason || 'Data yang Anda minta'}"</em></p>
                    </blockquote>
                    <p>Telah disetujui oleh admin.</p>
                    ${response_link ? `<p>Anda dapat mengakses data/informasi lebih lanjut melalui link berikut: <a href="${response_link}" target="_blank" rel="noopener noreferrer">${response_link}</a></p><p>Mohon gunakan data yang diberikan dengan bijak dan sesuai peruntukannya.</p>` : '<p>Silakan periksa kembali website atau hubungi admin untuk langkah selanjutnya jika diperlukan.</p>'}
                    <br>
                    <p>Terima kasih telah menggunakan Insight Hub.</p>
                    <p>Hormat kami,</p>
                    <p><strong>Tim Insight Hub PUPR</strong></p>
                    <p style="font-size: 0.8em; color: #777;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
                 </div>
            `;
        } else if (status === 'rejected') {
            emailSubject = `[Ditolak] Permintaan Data #${requestIdShort} - Insight Hub PUPR`;
            emailHtml = `
                 <div style="font-family: sans-serif; line-height: 1.6;">
                    <p>Halo ${userName || 'Pengguna'},</p>
                    <p>Setelah peninjauan, dengan berat hati kami memberitahukan bahwa permintaan data Anda (ID: #${requestIdShort}) untuk:</p>
                     <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; color: #555;">
                       <p><em>"${requestedReason || 'Data yang Anda minta'}"</em></p>
                    </blockquote>
                    <p>Belum dapat kami setujui saat ini.</p>
                    <p>Keputusan ini mungkin didasarkan pada ketersediaan data, kebijakan privasi, atau pertimbangan lainnya. Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi admin kami melalui kontak yang tersedia di website.</p>
                    <br>
                    <p>Terima kasih atas pengertian Anda.</p>
                    <p>Hormat kami,</p>
                    <p><strong>Tim Insight Hub PUPR</strong></p>
                    <p style="font-size: 0.8em; color: #777;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
                 </div>
            `;
        }

        try {
            console.log(`Mencoba mengirim email status ${status} ke ${userEmail}...`);
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'Insight Hub PUPR <onboarding@resend.dev>', // Ganti jika sudah verifikasi domain
                to: [userEmail],
                subject: emailSubject,
                html: emailHtml,
                tags: [
                    { name: 'category', value: 'request_status_update' },
                    { name: 'request_id', value: id },
                    { name: 'status', value: status },
                ],
            });

            if (emailError) {
                console.error(`Resend API Error (Status ${status}):`, emailError);
                // Tandai bahwa email gagal dikirim
                emailSentMessage = ' Namun, notifikasi email gagal dikirim.';
            } else {
                console.log(`Email status ${status} berhasil dikirim. Email ID:`, emailData?.id);
            }
        } catch (emailCatchError) {
             console.error(`Error tidak terduga saat mencoba mengirim email status ${status}:`, emailCatchError);
             emailSentMessage = ' Namun, notifikasi email gagal dikirim.';
        }
    } else if (!resend) {
        console.warn("Resend tidak diinisialisasi, email status tidak dikirim.");
        emailSentMessage = ' (Notifikasi email tidak aktif)';
    } else if (!userEmail) {
         console.warn("Email pengguna tidak ditemukan, email status tidak dikirim.");
         emailSentMessage = ' (Email pengguna tidak ditemukan)';
    }
    // === AKHIR BAGIAN BARU ===


    revalidatePath('/admin-dashboard');
    revalidatePath('/requests'); // Revalidate halaman requests juga

    // Tambahkan pesan tambahan ke message jika email gagal
    return { success: true, message: `Status permohonan berhasil diperbarui!${emailSentMessage}` };

  } catch (error) {
     console.error("Unexpected error in updateRequestStatus:", error);
     return { success: false, message: 'Terjadi kesalahan tidak terduga saat memperbarui status.' };
  }
}

// Fungsi deleteRequest (Tidak Diubah)
export async function deleteRequest(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
  if (!id) return { success: false, message: 'ID tidak valid.' };
  try {
    const { error } = await supabase.from('data_requests').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin-dashboard');
    revalidatePath('/requests');
    return { success: true, message: 'Permohonan berhasil dihapus!' };
  } catch (error) {
    console.error("Error deleting request:", error);
    return { success: false, message: `Gagal menghapus: ${error.message}` };
  }
}

// Fungsi deleteFeedback (Tidak Diubah)
export async function deleteFeedback(id) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
  if (!id) return { success: false, message: 'ID tidak valid.' };
  try {
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin-dashboard');
    revalidatePath('/feedback');
    return { success: true, message: 'Feedback berhasil dihapus!' };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return { success: false, message: `Gagal menghapus: ${error.message}` };
  }
}