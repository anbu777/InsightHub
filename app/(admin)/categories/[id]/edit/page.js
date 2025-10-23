// app/(admin)/categories/[id]/edit/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CategoryForm from '../../CategoryForm'; // Impor komponen form dari folder induk

// Fungsi untuk mengambil data Kategori yang akan diedit
async function getCategoryData(categoryId) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nama_kategori')
        .eq('id', categoryId)
        .single();

      if (error || !data) {
        console.error("Error fetching Category for edit:", error);
        notFound(); // Tampilkan 404 jika Kategori tidak ditemukan
      }
      return data;
  } catch (error) {
      console.error("Critical error in getCategoryData:", error);
      notFound(); // Tampilkan 404 jika ada error lain
  }
}

// Komponen Halaman Edit Kategori
export default async function EditCategoryPage({ params }) {
  const { id } = params; // Ambil ID dari URL
  const categoryData = await getCategoryData(id);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Kategori</h1>
      {/* Panggil komponen form dalam mode 'edit', kirim data awal */}
      <CategoryForm
        mode="edit"
        initialData={categoryData}
      />
    </div>
  );
}