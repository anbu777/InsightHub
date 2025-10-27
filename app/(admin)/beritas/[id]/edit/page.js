// app/(admin)/beritas/[id]/edit/page.js

// BARU: Impor helper Server Component
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import BeritaForm from '../../BeritaForm'; // Path ini sudah benar (naik 2 level)

// BARU: Tambahkan ini untuk memaksa rendering dinamis
export const dynamic = 'force-dynamic';

// Fungsi untuk mengambil data Berita yang akan diedit
async function getBeritaData(beritaId) {
  // BARU: Buat client baru yang spesifik untuk request ini
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
      const { data, error } = await supabase
        .from('berita')
        .select('*') // Ambil semua kolom untuk diedit
        .eq('id', beritaId)
        .single();

      if (error || !data) {
        console.error("Error fetching Berita for edit:", error);
        notFound(); // Tampilkan 404 jika Berita tidak ditemukan
      }
      return data;
  } catch (error) {
      console.error("Critical error in getBeritaData:", error);
      notFound();
  }
}

// Komponen Halaman Edit Berita
// === PERBAIKAN: Ambil 'id' langsung dari 'params' ===
export default async function EditBeritaPage({ params: { id } }) {
  // 'id' sekarang berisi ID dari URL
  const beritaData = await getBeritaData(id);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Berita</h1>
      <BeritaForm
        mode="edit"
        initialData={beritaData}
      />
    </div>
  );
}