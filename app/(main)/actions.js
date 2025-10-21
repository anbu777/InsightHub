// app/(main)/actions.js
'use server';

import { createClient } from '@supabase/supabase-js';

// Fungsi untuk mengirimkan data permintaan baru
export async function submitRequest(formData) {
  // Inisialisasi Supabase Client di sisi server
  // Pastikan variabel environment Anda sudah diatur di Vercel atau .env.local
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const dataToInsert = {
      user_name: formData.get('name'),
      user_phone: formData.get('phone'),
      user_email: formData.get('email'),
      organization: formData.get('entity'),
      reason: formData.get('dataType'), // 'reason' di tabel, 'dataType' di form
    };

    const { data, error } = await supabase
      .from('data_requests')
      .insert([dataToInsert]);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Pengajuan Anda berhasil terkirim!' };
  } catch (error) {
    console.error('Error submitting request:', error);
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

// Fungsi untuk mengirimkan data feedback/survei baru
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
      // Konversi rating ke angka, pastikan valid
      rating: parseInt(formData.get('satisfaction'), 10), 
      suggestion: formData.get('suggestion'),
    };

    const { data, error } = await supabase
      .from('feedback')
      .insert([dataToInsert]);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Terima kasih atas masukan Anda!' };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}
