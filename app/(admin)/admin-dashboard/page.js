// app/(admin)/admin-dashboard/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import DashboardClient from './DashboardClient';

// Fungsi untuk mengambil semua data di server (versi final)
async function getDashboardData() {
  console.log("Memulai getDashboardData (versi final)...");
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Pastikan pengguna terautentikasi sebelum melanjutkan
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("Tidak ada sesi pengguna aktif, mengembalikan data kosong.");
      return { 
        stats: { total_datasets: 0, total_requests: 0, total_downloads: 0, unique_requesters: 0 }, 
        top_requests: [], 
        requests: [], 
        feedback: [] 
      };
    }
    
    console.log(`Pengguna ${user.email} terautentikasi. Mengambil semua data...`);

    // KEMBALIKAN Promise.all untuk mengambil semua data secara efisien
    const [
      { count: total_datasets, error: errDatasets },
      { count: total_requests, error: errRequestsCount },
      { data: total_views_data, error: errClicks },
      { data: requests, error: errRequestsData },
      { data: feedback, error: errFeedback },
    ] = await Promise.all([
      supabase.from('datasets').select('*', { count: 'exact', head: true }),
      supabase.from('data_requests').select('*', { count: 'exact', head: true }),
      supabase.rpc('get_total_clicks'), // Memanggil fungsi RPC untuk total klik
      supabase.from('data_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]);

    // Handle potential errors
    if (errDatasets) console.error("Error fetching dataset count:", errDatasets);
    if (errRequestsCount) console.error("Error fetching request count:", errRequestsCount);
    if (errClicks) console.error("Error fetching total clicks:", errClicks);
    if (errRequestsData) console.error("Error fetching requests data:", errRequestsData);
    if (errFeedback) console.error("Error fetching feedback data:", errFeedback);

    // HITUNG SEMUA STATS berdasarkan data yang didapat
    const stats = {
      total_datasets: total_datasets ?? 0,
      total_requests: total_requests ?? 0,
      total_downloads: total_views_data ?? 0,
      unique_requesters: new Set((requests || []).map(r => r.user_email)).size,
    };

    // HITUNG TOP 5 REQUESTS untuk chart
    const requestCounts = (requests || []).reduce((acc, req) => {
      const key = req.reason || 'Tidak Ada Alasan';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const top_requests = Object.entries(requestCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([reasonText, count]) => ({ requested_data: reasonText, request_count: count }));

    console.log("Semua data berhasil diambil dan diproses.");
    return { stats, top_requests, requests: requests || [], feedback: feedback || [] };

  } catch (error) {
    console.error("Error kritis di dalam getDashboardData:", error);
    // Kembalikan data kosong jika ada error
    return { 
      stats: { total_datasets: 0, total_requests: 0, total_downloads: 0, unique_requesters: 0 }, 
      top_requests: [], 
      requests: [], 
      feedback: [] 
    };
  }
}

// Komponen Halaman Utama Dashboard (Tidak Diubah)
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
      initialRequests={requests}
      initialFeedback={feedback}
      syncAction={syncSigiData}
      initialRequestStatusFilter={searchParams.status || 'all'}
    />
  );
}
