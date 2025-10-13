import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// WAJIB: Gunakan 'export async function' untuk setiap metode (POST, GET, dll)
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password harus diisi." },
        { status: 400 }
      );
    }
    
    const supabaseUserClient = createRouteHandlerClient({ cookies });

    const { data: authData, error: authError } = await supabaseUserClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ message: "Email atau password salah." }, { status: 401 });
    }

    const user = authData.user;

    const supabaseAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: profileData, error: profileError } = await supabaseAdminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profileData) {
      await supabaseUserClient.auth.signOut();
      return NextResponse.json({ message: "Profil pengguna tidak bisa diakses atau tidak ditemukan." }, { status: 403 });
    }

    if (!profileData.is_admin) {
      await supabaseUserClient.auth.signOut();
      return NextResponse.json({ message: "Akses ditolak. Halaman ini hanya untuk admin." }, { status: 403 });
    }

    return NextResponse.json(
      {
        message: "Login sebagai admin berhasil",
        user: authData.user,
        session: authData.session,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error pada API login:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

