import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Keamanan: Pastikan hanya admin yang bisa mengakses
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    // Mengambil semua data dari tabel 'feedback', diurutkan dari yang terbaru
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("Error mengambil data feedback:", err);
    return NextResponse.json({ message: `Gagal mengambil data: ${err.message}` }, { status: 500 });
  }
}