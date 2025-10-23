// app/(admin)/categories/new/page.js
import CategoryForm from '../CategoryForm'; // Impor komponen form dari folder induk

// Komponen Halaman Tambah Kategori
export default function NewCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Kategori Baru</h1>
      {/* Panggil komponen form dalam mode 'create' */}
      <CategoryForm mode="create" />
    </div>
  );
}