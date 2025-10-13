import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Keamanan: Pastikan user sudah login
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Memanggil satu fungsi RPC 'get_dashboard_analytics' untuk mengambil semua data statistik
    const { data, error } = await supabase.rpc('get_dashboard_analytics');

    if (error) {
      // Jika pemanggilan fungsi gagal, lemparkan error
      throw error;
    }
    
    // Kembalikan data JSON lengkap yang sudah diolah oleh fungsi di database
    return NextResponse.json(data);

  } catch (err) {
    console.error("Error saat mengambil statistik dashboard:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}