// app/(main)/actions.js
'use server';

import { createClient } from '@supabase/supabase-js';
// BARU: Impor Resend
import { Resend } from 'resend';

// BARU: Inisialisasi Resend
// Pastikan RESEND_API_KEY ada di file .env.local Anda
let resend;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("Resend client initialized successfully.");
} else {
  console.warn("PERINGATAN: RESEND_API_KEY tidak ditemukan. Fitur notifikasi email tidak akan aktif.");
}

// Fungsi untuk mengirimkan data permintaan baru
export async function submitRequest(formData) {
  // Inisialisasi Supabase Client (Tidak Diubah)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Ambil data dari form (Tidak Diubah)
  const userName = formData.get('name');
  const userPhone = formData.get('phone');
  const userEmail = formData.get('email');
  const organization = formData.get('entity');
  const reason = formData.get('dataType');

  try {
    // 1. Simpan data ke Supabase (Modifikasi kecil: tambahkan .select().single())
    const dataToInsert = {
      user_name: userName,
      user_phone: userPhone,
      user_email: userEmail,
      organization: organization,
      reason: reason,
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('data_requests')
      .insert([dataToInsert])
      .select() // Ambil data yang baru dimasukkan
      .single(); // Asumsi satu baris

    if (insertError) {
      console.error('Error saving request to Supabase:', insertError);
      // Lempar error agar ditangkap catch di bawah dan pesan ditampilkan ke user
      throw new Error(`Gagal menyimpan permintaan: ${insertError.message}`);
    }

    console.log('Permintaan berhasil disimpan ke Supabase:', insertedData);

    // === BAGIAN BARU: Kirim Email Konfirmasi ===
    if (resend && userEmail && insertedData) { // Pastikan resend ada, email ada, dan insert berhasil
        try {
            console.log(`Mencoba mengirim email konfirmasi ke ${userEmail}...`);
            const { data: emailData, error: emailError } = await resend.emails.send({
                // Gunakan alamat 'from' default Resend. Ganti jika sudah verifikasi domain.
                from: 'Insight Hub PUPR <onboarding@resend.dev>',
                to: [userEmail], // Kirim ke email pengguna
                subject: `Konfirmasi Pengajuan Data #${insertedData.id.substring(0, 6)} - Insight Hub PUPR`, // Tambahkan ID singkat
                html: `
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p>Halo ${userName || 'Pengguna'},</p>
                        <p>Terima kasih telah mengajukan permintaan data melalui Insight Hub PUPR.</p>
                        <p>Permintaan Anda (ID: #${insertedData.id.substring(0, 6)}) untuk data berikut telah kami terima:</p>
                        <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; color: #555;">
                            <p><em>"${reason || 'Data yang Anda jelaskan'}"</em></p>
                        </blockquote>
                        <p>Permintaan Anda akan segera kami proses. Anda akan menerima email pemberitahuan selanjutnya mengenai status permintaan Anda (biasanya dalam beberapa hari kerja).</p>
                        <br>
                        <p>Hormat kami,</p>
                        <p><strong>Tim Insight Hub PUPR</strong></p>
                        <p style="font-size: 0.8em; color: #777;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
                    </div>
                `,
                // Tambahkan tags untuk pelacakan di Resend (opsional)
                tags: [
                    { name: 'category', value: 'request_confirmation' },
                    { name: 'request_id', value: insertedData.id },
                ],
            });

            if (emailError) {
                // Catat error tapi jangan gagalkan proses utama
                console.error("Resend API Error (Konfirmasi):", emailError);
            } else {
                 console.log("Email konfirmasi berhasil dikirim. Email ID:", emailData?.id);
            }
        } catch (emailCatchError) {
             console.error("Error tidak terduga saat mencoba mengirim email konfirmasi:", emailCatchError);
        }
    } else if (!resend) {
        console.warn("Resend tidak diinisialisasi, email konfirmasi tidak dikirim.");
    } else if (!userEmail) {
        console.warn("Email pengguna tidak valid, email konfirmasi tidak dikirim.");
    }
    // === AKHIR BAGIAN BARU ===


    return { success: true, message: 'Pengajuan Anda berhasil terkirim! Silakan cek email Anda untuk konfirmasi.' };

  } catch (error) {
    // Tangkap error dari Supabase atau error lainnya
    console.error('Error dalam submitRequest:', error);
    return { success: false, message: error.message || 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

// Fungsi untuk mengirimkan data feedback/survei baru (Tidak Diubah)
export async function submitFeedback(formData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const dataToInsert = {
      user_name: formData.get('name'),
      gender: formData.get('gender'),
      age_range: formData.get('age'),
      rating: parseInt(formData.get('satisfaction'), 10),
      suggestion: formData.get('suggestion'),
    };

    // Validasi sederhana rating
    if (isNaN(dataToInsert.rating) || dataToInsert.rating < 0 || dataToInsert.rating > 4) {
        throw new Error("Rating kepuasan tidak valid.");
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert([dataToInsert]);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Terima kasih atas masukan Anda!' };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, message: error.message || 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

