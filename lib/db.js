import { Pool } from 'pg';

// Pipa Koneksi 1: Untuk Database Kantor (DWH)
const dwhPool = new Pool({
    host: process.env.DWH_HOST,
    port: process.env.DWH_PORT,
    database: process.env.DWH_DATABASE,
    user: process.env.DWH_USER,
    password: process.env.DWH_PASSWORD,
    // --- PERBAIKAN DI SINI ---
    // Objek ssl dihapus agar tidak mencoba koneksi aman
});

// Pipa Koneksi 2: Untuk Database Lokal (Users)
const localPool = new Pool({
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    database: process.env.LOCAL_DB_DATABASE,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
});

export { dwhPool, localPool };

