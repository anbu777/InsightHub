import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  // DEBUG: pastikan service role key terbaca di runtime
  console.log("🔧 DEBUG - Service Key loaded:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Validasi sederhana
  if (!body.name || !body.suggestion) {
    return NextResponse.json({ message: 'Nama dan saran wajib diisi.' }, { status: 400 });
  }

  // Gunakan service key untuk memasukkan data
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin.from('feedback').insert({
    name: body.name,
    gender: body.gender,
    age_range: body.age_range,
    opinion_rating: body.opinion_rating,
    technical_rating: body.technical_rating,
    suggestion: body.suggestion,
  });

  if (error) {
    console.error('Supabase feedback insert error:', error);
    return NextResponse.json({ message: 'Gagal mengirim feedback.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Terima kasih atas masukan Anda!' }, { status: 201 });
}
