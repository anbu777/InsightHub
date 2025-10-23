// app/(admin)/unors/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import UnorTable from './UnorTable'; // Impor komponen tabel UNOR

// Fungsi untuk mengambil data UNOR di server
async function getUnors() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data, error } = await supabase
      .from('unors')
      .select('id, nama_unor, created_at')
      .order('nama_unor', { ascending: true }); // Urutkan berdasarkan nama

    if (error) {
      console.error("Error fetching unors:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Critical error in getUnors:", error);
    return [];
  }
}

// Komponen Halaman Daftar UNOR
export default async function UnorsPage() {
  const unors = await getUnors();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Unit Organisasi (UNOR)</h1>
        {/* Tombol Tambah Baru */}
        <Link
          href="/unors/new" // Arahkan ke halaman tambah UNOR
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          + Tambah UNOR Baru
        </Link>
      </div>

      {/* Tampilkan komponen tabel */}
      <UnorTable unors={unors} />
    </div>
  );
}