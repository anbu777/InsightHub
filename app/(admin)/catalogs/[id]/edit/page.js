// app/(admin)/catalogs/[id]/edit/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CatalogForm from '../../CatalogForm'; // Impor komponen form

// Fungsi untuk mengambil data UNOR, Kategori, dan data katalog yang akan diedit
async function getEditFormData(catalogId) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const [unorsRes, categoriesRes, catalogRes] = await Promise.all([
    supabase.from('unors').select('id, nama_unor').order('nama_unor'),
    supabase.from('categories').select('id, nama_kategori').order('nama_kategori'),
    // Ambil semua kolom datasets untuk di-pass ke form
    supabase.from('datasets').select('*').eq('id', catalogId).single(), 
  ]);

  // Handle errors
  if (unorsRes.error) console.error("Error fetching unors for edit:", unorsRes.error);
  if (categoriesRes.error) console.error("Error fetching categories for edit:", categoriesRes.error);
  
  // Jika katalog tidak ditemukan, tampilkan halaman 404
  if (catalogRes.error || !catalogRes.data) {
    console.error("Error fetching catalog data for edit:", catalogRes.error);
    notFound(); 
  }

  return {
    unors: unorsRes.data || [],
    categories: categoriesRes.data || [],
    catalogData: catalogRes.data, // Data katalog yang akan diedit
  };
}

export default async function EditCatalogPage({ params }) {
  const { id } = params; // Ambil ID dari URL
  const { unors, categories, catalogData } = await getEditFormData(id);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Katalog Data</h1>
      <CatalogForm 
        unors={unors} 
        categories={categories} 
        mode="edit" // Beri tahu form bahwa ini mode 'edit'
        initialData={catalogData} // Kirim data awal ke form
      />
    </div>
  );
}