// app/(admin)/unors/new/page.js
import UnorForm from '../UnorForm'; // Impor komponen form (akan dibuat)

// Komponen Halaman Tambah UNOR
export default function NewUnorPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Unit Organisasi Baru</h1>
      {/* Panggil komponen form dalam mode 'create' */}
      <UnorForm mode="create" />
    </div>
  );
}