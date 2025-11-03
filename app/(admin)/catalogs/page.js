// app/(admin)/catalogs/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import CatalogTable from './CatalogTable'; // Impor komponen tabel

// Fungsi untuk mengambil data katalog di server
async function getCatalogs() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // === PERUBAHAN: Tambahkan data_url dan metadata ke select ===
    const { data, error } = await supabase
      .from('datasets')
      .select(`
        id,
        title,
        created_at,
        data_url, 
        metadata, 
        unors ( nama_unor ),
        categories ( nama_kategori )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching catalogs:", error);
      throw error; // Lempar error agar bisa ditangani
    }

    // Ubah struktur data agar lebih mudah digunakan di tabel
    const formattedData = data.map(item => ({
        ...item,
        nama_unor: item.unors?.nama_unor || 'N/A',
        nama_kategori: item.categories?.nama_kategori || 'N/A',
        unors: undefined, 
        categories: undefined,
    }));

    return formattedData || []; // Kembalikan array kosong jika data null

  } catch (error) {
    console.error("Critical error in getCatalogs:", error);
    return []; // Kembalikan array kosong jika terjadi error
  }
}

// Komponen Halaman Daftar Katalog
export default async function CatalogsPage() {
  const catalogs = await getCatalogs();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Katalog Data</h1>
        {/* Tombol Tambah Baru */}
        <Link 
          href="/catalogs/new" 
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          + Tambah Katalog Baru
        </Link>
      </div>

      {/* Tampilkan komponen tabel, teruskan data */}
      <CatalogTable catalogs={catalogs} />
    </div>
  );
}