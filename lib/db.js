import { Pool } from 'pg';

// Inisialisasi pool koneksi sekali saja untuk digunakan di seluruh aplikasi.
// Konfigurasi diambil secara otomatis dari file .env.local
let pool;

if (!pool) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Ekspor pool agar bisa diimpor dan digunakan oleh file API lainnya.
export default pool;  