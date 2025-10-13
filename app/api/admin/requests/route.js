import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Keamanan: Pastikan hanya admin yang login yang bisa mengakses
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }
  // Anda bisa menambahkan pengecekan peran admin di sini jika perlu

  try {
    // Ambil parameter 'status' dari URL, contoh: /api/admin/requests?status=pending
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Mulai membangun query ke Supabase
    let query = supabase.from('data_requests').select('*');

    // Jika ada parameter status, tambahkan filter .eq()
    if (status) {
      query = query.eq('status', status);
    }

    // Urutkan hasilnya berdasarkan tanggal dibuat, yang terbaru di atas
    query = query.order('created_at', { ascending: false });

    // Jalankan query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("Error mengambil data permohonan:", err);
    return NextResponse.json({ message: `Gagal mengambil data: ${err.message}` }, { status: 500 });
  }
}