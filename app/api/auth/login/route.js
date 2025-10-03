import { NextResponse } from 'next/server';
import { localPool as pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    let client;
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Email dan password harus diisi.' }, { status: 400 });
        }

        client = await pool.connect();

        // 1. Cari user berdasarkan email
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);

        // Jika user dengan email tersebut tidak ditemukan
        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 });
        }

        const user = result.rows[0];

        // 2. Bandingkan password yang diinput dengan yang ada di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 });
        }

        // Jika berhasil, kirim data user (tanpa password)
        const { password: _, ...userWithoutPassword } = user;
        
        return NextResponse.json(userWithoutPassword, { status: 200 });

    } catch (error) {
        console.error('Error pada API login:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}