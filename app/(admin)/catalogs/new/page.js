// app/(admin)/catalogs/new/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CatalogForm from '../CatalogForm'; // Impor komponen form dari folder induk

// Fungsi untuk mengambil data UNOR dan Kategori untuk dropdown
async function getFormData() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const [unorsRes, categoriesRes] = await Promise.all([
    supabase.from('unors').select('id, nama_unor').order('nama_unor'),
    supabase.from('categories').select('id, nama_kategori').order('nama_kategori'),
  ]);

  // Basic error handling
  if (unorsRes.error) console.error("Error fetching unors:", unorsRes.error);
  if (categoriesRes.error) console.error("Error fetching categories:", categoriesRes.error);

  return {
    unors: unorsRes.data || [],
    categories: categoriesRes.data || [],
  };
}

// Komponen Halaman Tambah Katalog
export default async function NewCatalogPage() {
  const { unors, categories } = await getFormData();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Katalog Data Baru</h1>
      {/* Panggil komponen form dalam mode 'create' */}
      <CatalogForm
        unors={unors}
        categories={categories}
        mode="create"
      />
    </div>
  );
}