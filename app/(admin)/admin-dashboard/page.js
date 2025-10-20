// app/(admin)/admin-dashboard/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast'; // Kita akan panggil toast dari Server Action

// Komponen Client terpisah untuk interaktivitas
import DashboardClient from './DashboardClient';

// Fungsi untuk mengambil semua data di server
async function getDashboardData() {
    const supabase = createServerComponentClient({ cookies });

    // Jalankan semua query secara paralel
    const [
        { count: total_datasets },
        { count: total_requests },
        { data: total_views_data },
        { data: requests },
        { data: feedback },
    ] = await Promise.all([
        supabase.from('datasets').select('*', { count: 'exact', head: true }),
        supabase.from('data_requests').select('*', { count: 'exact', head: true }),
        supabase.rpc('get_total_clicks'),
        supabase.from('data_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]);

    const stats = {
        total_datasets: total_datasets ?? 0,
        total_requests: total_requests ?? 0,
        total_downloads: total_views_data ?? 0, // Menggunakan total_clicks sebagai total unduhan
        unique_requesters: new Set((requests || []).map(r => r.email)).size, // Hitung pengguna unik
    };

    // Logika untuk chart (Top 5 Paling Sering Diminta)
    const requestCounts = (requests || []).reduce((acc, req) => {
        const key = req.requested_data || 'Tidak Diketahui';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    
    const top_requests = Object.entries(requestCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ requested_data: name, request_count: count }));

    return { stats, top_requests, requests, feedback };
}

// Komponen Halaman Utama Dashboard (Server Component)
export default async function AdminDashboardPage({ searchParams }) {
    // Ambil data di server
    const { stats, top_requests, requests, feedback } = await getDashboardData();
    
    // Server Action untuk sinkronisasi data
    async function syncSigiData() {
        "use server";
        try {
            // Logika sinkronisasi Anda ditempatkan di sini
            // Contoh: Panggil API eksternal atau proses lainnya
            console.log("Memulai sinkronisasi data SIGI...");
            // await fetch('URL_SIGI_API', { method: 'POST', ... });
            // Anggap saja berhasil setelah 2 detik
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("Sinkronisasi berhasil.");

            revalidatePath('/admin-dashboard'); // Refresh data di halaman ini
            return { success: true, message: 'Sinkronisasi data SIGI berhasil diselesaikan.' };
        } catch (error) {
            console.error("Gagal sinkronisasi:", error);
            return { success: false, message: `Gagal: ${error.message}` };
        }
    }

    // Teruskan semua data dan Server Action ke Client Component
    return (
        <DashboardClient
            stats={stats}
            topRequests={top_requests}
            initialRequests={requests || []}
            initialFeedback={feedback || []}
            syncAction={syncSigiData}
            initialRequestStatusFilter={searchParams.status || 'all'}
        />
    );
}