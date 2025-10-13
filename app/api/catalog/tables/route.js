import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Mengambil semua data dari tabel 'datasets' di proyek Supabase Anda
    const { data, error } = await supabase.from('datasets').select('*');

    if (error) {
      // Jika Supabase mengembalikan error, lemparkan agar ditangkap oleh blok catch
      throw error;
    }

    // Jika berhasil, kembalikan data dalam format JSON
    return NextResponse.json({ data });

  } catch (err) {
    console.error("Error mengambil data dari Supabase:", err);
    return NextResponse.json(
      { message: `Gagal mengambil data: ${err.message}` },
      { status: 500 }
    );
  }
}