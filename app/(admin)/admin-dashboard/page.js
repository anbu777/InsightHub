// app/(admin)/admin-dashboard/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import DashboardClient from './DashboardClient';

async function getDashboardData() {
  console.log("Memulai getDashboardData (versi final + chart data)...");
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("Tidak ada sesi pengguna aktif.");
      return { 
        stats: { total_datasets: 0, total_requests: 0, total_downloads: 0, unique_requesters: 0 }, 
        top_requests: [], 
        recentRequests: [], 
        recentFeedback: [],
        categoryDistribution: [], 
        unorDistribution: [],      
        feedbackDistribution: []   
      };
    }

    console.log(`Pengguna ${user.email} terautentikasi.`);

    const results = await Promise.all([
      supabase.from('datasets').select('id', { count: 'exact', head: true }),
      supabase.from('data_requests').select('id', { count: 'exact', head: true }),
      supabase.rpc('get_total_clicks'),
      supabase.from('data_requests').select('reason, user_email').order('created_at', { ascending: false }),
      supabase.from('data_requests').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(5),
      // Ambil semua data (tanpa .group) untuk diolah manual
      supabase.from('datasets').select('categories(nama_kategori)'),
      supabase.from('datasets').select('unors(nama_unor)'),
      supabase.from('feedback').select('rating')
    ]);

    const [
      { count: total_datasets, error: errDatasets },
      { count: total_requests, error: errRequestsCount },
      { data: total_views_data, error: errClicks },
      { data: allRequestsForChart, error: errAllRequests },
      { data: recentRequests, error: errRecentRequests },
      { data: recentFeedback, error: errRecentFeedback },
      { data: categoryData, error: errCategory },
      { data: unorData, error: errUnor },
      { data: feedbackData, error: errFeedback }
    ] = results;

    if (errDatasets) console.error("Error fetching dataset count:", errDatasets);
    if (errRequestsCount) console.error("Error fetching request count:", errRequestsCount);
    if (errClicks) console.error("Error fetching total clicks:", errClicks);
    if (errAllRequests) console.error("Error fetching all requests for chart:", errAllRequests);
    if (errRecentRequests) console.error("Error fetching recent requests:", errRecentRequests);
    if (errRecentFeedback) console.error("Error fetching recent feedback:", errRecentFeedback);
    if (errCategory) console.error("Error fetching category data:", errCategory);
    if (errUnor) console.error("Error fetching unor data:", errUnor);
    if (errFeedback) console.error("Error fetching feedback data:", errFeedback);

    // Hitung Stats
    const stats = {
      total_datasets: total_datasets ?? 0,
      total_requests: total_requests ?? 0,
      total_downloads: total_views_data ?? 0,
      unique_requesters: new Set((allRequestsForChart || []).map(r => r.user_email)).size,
    };

    // Hitung Top 5 Requests
    const requestCounts = (allRequestsForChart || []).reduce((acc, req) => {
      const key = req.reason || 'Tidak Ada Alasan';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top_requests = Object.entries(requestCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([reasonText, count]) => ({ requested_data: reasonText, request_count: count }));

    // === Olah data kategori (group by manual) ===
    const categoryDistribution = Object.values(
      (categoryData || []).reduce((acc, item) => {
        const name = item.categories?.nama_kategori || 'Tanpa Kategori';
        acc[name] = acc[name] || { name, count: 0 };
        acc[name].count += 1;
        return acc;
      }, {})
    );

    const unorDistribution = Object.values(
      (unorData || []).reduce((acc, item) => {
        const name = item.unors?.nama_unor || 'Tanpa UNOR';
        acc[name] = acc[name] || { name, count: 0 };
        acc[name].count += 1;
        return acc;
      }, {})
    );

    // === Olah data feedback (rating 0-4) ===
    const feedbackLabels = ['😡 (0)', '☹️ (1)', '😐 (2)', '🙂 (3)', '😄 (4)'];
    const feedbackCounts = Array(5).fill(0);
    (feedbackData || []).forEach(item => {
      if (item.rating >= 0 && item.rating < 5) {
        feedbackCounts[item.rating] += 1;
      }
    });
    const feedbackDistribution = { labels: feedbackLabels, counts: feedbackCounts };

    console.log("Semua data dashboard berhasil diambil.");
    return { 
      stats, 
      top_requests, 
      recentRequests: recentRequests || [], 
      recentFeedback: recentFeedback || [],
      categoryDistribution,
      unorDistribution,
      feedbackDistribution
    };

  } catch (error) {
    console.error("Error kritis di getDashboardData:", error);
    return { 
      stats: {}, 
      top_requests: [], 
      recentRequests: [], 
      recentFeedback: [], 
      categoryDistribution: [], 
      unorDistribution: [], 
      feedbackDistribution: [] 
    };
  }
}

// Komponen Halaman Utama Dashboard (Server Component)
export default async function AdminDashboardPage({ searchParams }) {
  const { stats, top_requests, recentRequests, recentFeedback, categoryDistribution, unorDistribution, feedbackDistribution } = await getDashboardData(); 

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
      initialRequests={recentRequests} 
      initialFeedback={recentFeedback}
      syncAction={syncSigiData}
      categoryDistributionData={categoryDistribution}
      unorDistributionData={unorDistribution}
      feedbackDistributionData={feedbackDistribution}
    />
  );
}
