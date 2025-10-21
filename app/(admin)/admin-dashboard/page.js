// app/(admin)/admin-dashboard/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import DashboardClient from './DashboardClient'; // Pastikan path ini benar

// Fungsi untuk mengambil data (versi Sederhana untuk Debugging)
async function getDashboardData() {
  console.log("Memulai getDashboardData...");
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let user = null;
  let requests = [];
  let feedback = [];
  let stats = { total_datasets: 0, total_requests: 0, total_downloads: 0, unique_requesters: 0 };
  let top_requests = [];

  try {
    // === Langkah 1: Fokus HANYA pada Autentikasi ===
    console.log("Mencoba mengambil data pengguna (auth.getUser)...");
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error saat auth.getUser():", authError);
      throw authError; // Hentikan jika autentikasi gagal
    }

    user = userData.user;
    console.log("Data pengguna didapat:", user ? user.email : "Tidak ada sesi");

    // === Langkah 2: AMBIL DATA HANYA JIKA Autentikasi Berhasil ===
    if (user) { 
      console.log("Autentikasi berhasil, mencoba mengambil data tabel...");
      // Kita coba ambil data satu per satu, bukan paralel, untuk debugging
      const { data: reqData, error: reqError } = await supabase
        .from('data_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (reqError) console.error("Error fetching requests:", reqError);
      else requests = reqData || [];

      const { data: fbData, error: fbError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fbError) console.error("Error fetching feedback:", fbError);
      else feedback = fbData || [];

      // (Query untuk stats dan top_requests bisa ditambahkan di sini jika 2 query di atas berhasil)
      // Untuk sementara kita biarkan kosong agar fokus pada masalah utama
       console.log("Pengambilan data tabel selesai.");

    } else {
        console.log("Tidak ada sesi pengguna aktif, data tidak diambil.");
    }

  } catch (error) {
    console.error("Error di dalam getDashboardData:", error);
    // Pastikan mengembalikan struktur data yang sama meskipun kosong
    requests = [];
    feedback = [];
  }

  // Debugging log final
  console.log("--- Data from Server (Final) ---");
  console.log("Requests:", requests);
  console.log("Feedback:", feedback);
  console.log("-------------------------------");

  // Hitung stats & top_requests berdasarkan data yang didapat
   stats = {
      // ... (hitung stats berdasarkan requests dan feedback jika ada) ...
      total_requests: requests.length, // Contoh sederhana
      unique_requesters: new Set(requests.map(r => r.user_email)).size,
      // (total_datasets & total_downloads perlu query tambahan jika diperlukan)
   };
   // ... (hitung top_requests jika diperlukan) ...


  return { stats, top_requests, requests, feedback };
}

// Komponen Halaman Utama (Tidak banyak berubah)
export default async function AdminDashboardPage({ searchParams }) {
  const { stats, top_requests, requests, feedback } = await getDashboardData();

  async function syncSigiData() {
    "use server";
     try {
        console.log("Memulai sinkronisasi data SIGI...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Sinkronisasi berhasil.");

        revalidatePath('/admin-dashboard'); 
        return { success: true, message: 'Sinkronisasi data SIGI berhasil diselesaikan.' };
    } catch (error) {
        console.error("Gagal sinkronisasi:", error);
        return { success: false, message: `Gagal: ${error.message}` };
    }
  }

  return (
    <DashboardClient
      stats={stats}
      topRequests={top_requests}
      initialRequests={requests || []} // Pastikan array kosong jika null
      initialFeedback={feedback || []} // Pastikan array kosong jika null
      syncAction={syncSigiData}
      initialRequestStatusFilter={searchParams.status || 'all'}
    />
  );
}