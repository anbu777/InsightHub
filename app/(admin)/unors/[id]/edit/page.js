// app/(admin)/unors/[id]/edit/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import UnorForm from '../../UnorForm'; // Impor komponen form dari folder induk

// Fungsi untuk mengambil data UNOR yang akan diedit
async function getUnorData(unorId) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from('unors')
    .select('id, nama_unor')
    .eq('id', unorId)
    .single();

  if (error || !data) {
    console.error("Error fetching UNOR for edit:", error);
    notFound(); // Tampilkan 404 jika UNOR tidak ditemukan
  }
  return data;
}

// Komponen Halaman Edit UNOR
export default async function EditUnorPage({ params }) {
  const { id } = params; // Ambil ID dari URL
  const unorData = await getUnorData(id);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Unit Organisasi</h1>
      {/* Panggil komponen form dalam mode 'edit', kirim data awal */}
      <UnorForm
        mode="edit"
        initialData={unorData}
      />
    </div>
  );
}