// app/(admin)/berita/new/page.js
import BeritaForm from '../BeritaForm'; // Impor komponen form

// Komponen Halaman Tambah Berita
export default function NewBeritaPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tulis Berita Baru</h1>
      {/* Panggil komponen form dalam mode 'create' */}
      <BeritaForm mode="create" />
    </div>
  );
}