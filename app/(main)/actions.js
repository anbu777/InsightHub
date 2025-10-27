// app/(main)/actions.js
'use server';

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// --- PASTIKAN INI ADA DI ATAS ---
// Inisialisasi Supabase Client (Sekali saja di atas)
// PENTING: Gunakan Service Role Key untuk operasi server action
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
// --- BATAS DEFINISI ---

// Inisialisasi Resend
let resend;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("Resend client initialized successfully.");
} else {
    console.warn("PERINGATAN: RESEND_API_KEY tidak ditemukan. Fitur notifikasi email tidak akan aktif.");
}

// Fungsi submitRequest (Gunakan supabaseAdmin dari atas)
export async function submitRequest(formData) {
    const userName = formData.get('name');
    const userPhone = formData.get('phone');
    const userEmail = formData.get('email');
    const organization = formData.get('entity');
    const reason = formData.get('dataType');

    try {
        const dataToInsert = { user_name: userName, user_phone: userPhone, user_email: userEmail, organization: organization, reason: reason, };
        // Gunakan supabaseAdmin
        const { data: insertedData, error: insertError } = await supabaseAdmin
            .from('data_requests').insert([dataToInsert]).select().single();
        if (insertError) { throw new Error(`Gagal menyimpan permintaan: ${insertError.message}`); }
        console.log('Permintaan berhasil disimpan ke Supabase:', insertedData);

        // ... (Logika email Resend tetap sama) ...
        if (resend && userEmail && insertedData) {
            try {
                console.log(`Mencoba mengirim email konfirmasi ke ${userEmail}...`);
                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'Insight Hub PUPR <onboarding@resend.dev>', to: [userEmail],
                    subject: `Konfirmasi Pengajuan Data #${insertedData.id.substring(0, 6)} - Insight Hub PUPR`,
                    html: `<div style="font-family: sans-serif; line-height: 1.6;"><p>Halo ${userName || 'Pengguna'},</p><p>Terima kasih telah mengajukan permintaan data melalui Insight Hub PUPR.</p><p>Permintaan Anda (ID: #${insertedData.id.substring(0, 6)}) untuk data berikut telah kami terima:</p><blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em; color: #555;"><p><em>"${reason || 'Data yang Anda jelaskan'}"</em></p></blockquote><p>Permintaan Anda akan segera kami proses. Anda akan menerima email pemberitahuan selanjutnya mengenai status permintaan Anda (biasanya dalam beberapa hari kerja).</p><br><p>Hormat kami,</p><p><strong>Tim Insight Hub PUPR</strong></p><p style="font-size: 0.8em; color: #777;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p></div>`,
                    tags: [{ name: 'category', value: 'request_confirmation' },{ name: 'request_id', value: insertedData.id },],
                });
                if (emailError) { console.error("Resend API Error (Konfirmasi):", emailError); }
                else { console.log("Email konfirmasi berhasil dikirim. Email ID:", emailData?.id); }
            } catch (emailCatchError) { console.error("Error tidak terduga saat mencoba mengirim email konfirmasi:", emailCatchError); }
        } else if (!resend) { console.warn("Resend tidak diinisialisasi, email konfirmasi tidak dikirim."); }
        else if (!userEmail) { console.warn("Email pengguna tidak valid, email konfirmasi tidak dikirim."); }

        return { success: true, message: 'Pengajuan Anda berhasil terkirim! Silakan cek email Anda untuk konfirmasi.' };

    } catch (error) {
        console.error('Error dalam submitRequest:', error);
        return { success: false, message: error.message || 'Terjadi kesalahan. Silakan coba lagi.' };
    }
}

// Fungsi submitFeedback (Gunakan supabaseAdmin dari atas)
export async function submitFeedback(formData) {
    try {
        const dataToInsert = {
            user_name: formData.get('name'), gender: formData.get('gender'), age_range: formData.get('age'),
            rating: parseInt(formData.get('satisfaction'), 10), suggestion: formData.get('suggestion'),
        };
        if (isNaN(dataToInsert.rating) || dataToInsert.rating < 0 || dataToInsert.rating > 4) { throw new Error("Rating kepuasan tidak valid."); }
        // Gunakan supabaseAdmin
        const { error } = await supabaseAdmin.from('feedback').insert([dataToInsert]);
        if (error) { throw error; }
        return { success: true, message: 'Terima kasih atas masukan Anda!' };
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, message: error.message || 'Terjadi kesalahan. Silakan coba lagi.' };
    }
}

// Fungsi incrementClickCount (Gunakan supabaseAdmin dari atas)
export async function incrementClickCount(datasetId) {
    if (!datasetId) {
        console.error('incrementClickCount called without datasetId');
        return { success: false, message: 'Dataset ID tidak valid.' };
    }

    try {
        // Gunakan supabaseAdmin
        const { error } = await supabaseAdmin.rpc('increment_click_count', {
            row_id: datasetId
        });

        if (error) {
            console.error('Error calling increment_click_count RPC:', error);
            throw error; // Lempar error
        }

        console.log(`Click count incremented for dataset ID: ${datasetId}`);
        return { success: true };

    } catch (error) {
        console.error('Error in incrementClickCount action:', error);
        return { success: false, message: 'Gagal memperbarui hitungan.' };
    }
}