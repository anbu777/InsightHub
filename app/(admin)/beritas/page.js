// app/(admin)/beritas/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import BeritaTable from './BeritaTable'; // Impor komponen tabel Berita

// Fungsi untuk mengambil data Berita di server
async function getBerita() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Ambil data berita, urutkan dari yang terbaru
    const { data, error } = await supabase
      .from('berita')
      .select('id, title, excerpt, created_at') // Hanya ambil kolom yang perlu untuk daftar
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching berita:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Critical error in getBerita:", error);
    return [];
  }
}

// Komponen Halaman Daftar Berita
export default async function BeritaPage() {
  const beritaItems = await getBerita();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Berita</h1>
        {/* === PERBAIKAN DI SINI === */}
        <Link
          href="/beritas/new" // Arahkan ke halaman tambah Berita di /beritas
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          + Tulis Berita Baru
        </Link>
        {/* === AKHIR PERBAIKAN === */}
      </div>

      {/* Tampilkan komponen tabel */}
      <BeritaTable beritaItems={beritaItems} />
    </div>
  );
}