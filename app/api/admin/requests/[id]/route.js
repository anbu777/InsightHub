import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Fungsi PUT untuk menghandle update
export async function PUT(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params; // Mengambil ID dari URL, contoh: /api/admin/requests/abc-123

  // Keamanan: Pastikan admin sudah login
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    // Ambil data baru (status dan link balasan) dari body request
    const { status, response_link } = await request.json();

    // Lakukan update ke Supabase
    const { data, error } = await supabase
      .from('data_requests')
      .update({ 
        status: status,
        response_link: response_link 
      })
      .eq('id', id) // Pastikan hanya baris dengan ID yang cocok yang di-update
      .select() // Minta Supabase mengembalikan data yang baru di-update
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error(`Error memperbarui permohonan ${id}:`, err);
    return NextResponse.json({ message: `Gagal memperbarui data: ${err.message}` }, { status: 500 });
  }
}