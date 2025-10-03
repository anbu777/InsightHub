import { NextResponse } from 'next/server';
import { localPool as pool } from '@/lib/db'; // Gunakan koneksi ke database LOKAL
import bcrypt from 'bcryptjs';

export async function POST(request) {
    let client;
    try {
        const { name, email, password, role = 'user' } = await request.json();
        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Nama, email, dan password diperlukan.' }, { status: 400 });
        }

        client = await pool.connect();

        // 1. Logika Khusus jika mendaftar sebagai 'admin'
        if (role === 'admin') {
            const adminCheckQuery = 'SELECT COUNT(*) FROM users WHERE role = $1';
            const adminCheckResult = await client.query(adminCheckQuery, ['admin']);
            
            if (parseInt(adminCheckResult.rows[0].count) > 0) {
                // Jika sudah ada admin, tolak pendaftaran admin baru
                return NextResponse.json({ message: 'Registrasi admin gagal: Akun admin sudah ada.' }, { status: 409 });
            }
        }

        // 2. Cek apakah email sudah terdaftar (berlaku untuk semua role)
        const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUser = await client.query(emailCheckQuery, [email]);
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
        }

        // 3. Jika semua pengecekan lolos, simpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role';
        const result = await client.query(insertQuery, [name, email, hashedPassword, role]);
        
        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error('Error pada API registrasi:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}