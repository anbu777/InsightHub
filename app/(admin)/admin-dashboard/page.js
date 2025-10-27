// app/(admin)/admin-dashboard/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
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
      supabase.from('datasets').select('categories(nama_kategori)'),
      supabase.from('datasets').select('unors(nama_unor)'),
      supabase.from('feedback').select('rating')
    ]);

    const [
      { count: total_datasets },
      { count: total_requests },
      { data: total_views_data },
      { data: allRequestsForChart },
      { data: recentRequests },
      { data: recentFeedback },
      { data: categoryData },
      { data: unorData },
      { data: feedbackData }
    ] = results;

    const stats = {
      total_datasets: total_datasets ?? 0,
      total_requests: total_requests ?? 0,
      total_downloads: total_views_data ?? 0,
      unique_requesters: new Set((allRequestsForChart || []).map(r => r.user_email)).size,
    };

    const requestCounts = (allRequestsForChart || []).reduce((acc, req) => {
      const key = req.reason || 'Tidak Ada Alasan';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top_requests = Object.entries(requestCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([reasonText, count]) => ({ requested_data: reasonText, request_count: count }));

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

    const feedbackLabels = ['😡 (0)', '☹️ (1)', '😐 (2)', '🙂 (3)', '😄 (4)'];
    const feedbackCounts = Array(5).fill(0);
    (feedbackData || []).forEach(item => {
      if (item.rating >= 0 && item.rating < 5) {
        feedbackCounts[item.rating] += 1;
      }
    });
    const feedbackDistribution = { labels: feedbackLabels, counts: feedbackCounts };

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

export default async function AdminDashboardPage() {
  const { stats, top_requests, recentRequests, recentFeedback, categoryDistribution, unorDistribution, feedbackDistribution } = await getDashboardData(); 

  return (
    <DashboardClient
      stats={stats}
      topRequests={top_requests}
      initialRequests={recentRequests} 
      initialFeedback={recentFeedback}
      categoryDistributionData={categoryDistribution}
      unorDistributionData={unorDistribution}
      feedbackDistributionData={feedbackDistribution}
    />
  );
}
