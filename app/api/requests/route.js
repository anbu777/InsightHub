import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, phone, agency, dataType, details } = await request.json();

  // Validasi sederhana
  if (!name || !email || !dataType || !details) {
    return NextResponse.json({ message: 'Harap isi semua kolom yang wajib.' }, { status: 400 });
  }

  // Gunakan service key untuk memasukkan data, melewati RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin.from('data_requests').insert({
    name: name,
    email: email,
    phone_number: phone,
    agency: agency,
    requested_data: `${dataType} - ${details}`,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ message: 'Gagal mengirim permohonan.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Permohonan Anda berhasil terkirim!' }, { status: 201 });
}