// app/(admin)/requests/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// Impor komponen tabel dari folder dashboard (atau pindahkan jika perlu)
import DataRequestTable from '../admin-dashboard/DataRequestTable'; 

// Fungsi untuk mengambil SEMUA data permintaan
async function getAllRequests() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Pastikan user adalah admin sebelum fetch
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return []; // Atau redirect
    // const isAdmin = await checkAdminStatus(supabase, user.id); // Implementasikan checkAdminStatus jika perlu
    // if (!isAdmin) return [];

    const { data, error } = await supabase
      .from('data_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching all requests:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Critical error in getAllRequests:", error);
    return [];
  }
}

// Komponen Halaman Daftar Permintaan
export default async function RequestsPage({ searchParams }) {
  const allRequests = await getAllRequests();
  const currentStatusFilter = searchParams?.status || 'all'; // Ambil filter dari URL

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Judul halaman tidak perlu karena tabel sudah punya judul */}
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Permohonan Data</h1> */}
      
      {/* Langsung render komponen tabel dengan SEMUA data */}
      <DataRequestTable
        // Berikan nama prop yang berbeda agar jelas ini adalah data lengkap
        initialRequests={allRequests} 
        initialStatusFilter={currentStatusFilter}
        // Kita mungkin perlu menambahkan prop isFullPage={true} jika ingin styling berbeda
      />
    </div>
  );
}

// (Fungsi checkAdminStatus bisa diimpor dari file utilitas atau didefinisikan di sini)