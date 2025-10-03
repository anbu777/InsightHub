import { Pool } from 'pg';

// Pipa Koneksi 1: Untuk Database Kantor (DWH) - Butuh VPN
// Menghubungkan ke data katalog 'sigi'
const dwhPool = new Pool({
    host: process.env.DWH_HOST,
    port: process.env.DWH_PORT,
    database: process.env.DWH_DATABASE,
    user: process.env.DWH_USER,
    password: process.env.DWH_PASSWORD,
    // PERBAIKAN: Opsi 'ssl' dihapus untuk mengatasi error koneksi
});

// Pipa Koneksi 2: Untuk Database Lokal (Users) - Tidak Butuh VPN
// Menghubungkan ke data login dan register di PostgreSQL lokal Anda
const localPool = new Pool({
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    database: process.env.LOCAL_DB_DATABASE,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
});

// Ekspor kedua koneksi agar bisa digunakan di file-file API
export { dwhPool, localPool };