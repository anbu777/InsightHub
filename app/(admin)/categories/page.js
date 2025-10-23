// app/(admin)/categories/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import CategoryTable from './CategoryTable'; // Impor komponen tabel Kategori

// Fungsi untuk mengambil data Kategori di server
async function getCategories() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, nama_kategori, created_at')
      .order('nama_kategori', { ascending: true }); // Urutkan berdasarkan nama

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Critical error in getCategories:", error);
    return [];
  }
}

// Komponen Halaman Daftar Kategori
export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kategori Data</h1>
        {/* Tombol Tambah Baru */}
        <Link
          href="/categories/new" // Path sudah benar
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          + Tambah Kategori Baru
        </Link>
      </div>

      {/* Tampilkan komponen tabel */}
      <CategoryTable categories={categories} />
    </div>
  );
}