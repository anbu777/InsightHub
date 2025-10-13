"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DataRequestTable from './DataRequestTable';
import FeedbackTable from './FeedbackTable'; // <-- PENAMBAHAN 1

ChartJS.register( CategoryScale, LinearScale, BarElement, Tooltip, Legend );

// Komponen Kartu Statistik (Tidak Diubah)
const StatCard = ({ title, value, color }) => (
    <div className={`${color} text-white rounded-xl shadow-lg p-6`}>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

// Komponen Utama Halaman Dashboard
export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ 
        total_datasets: 0, 
        total_requests: 0,
        total_downloads: 0,
        unique_requesters: 0 
    });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState({ type: '', text: '' });

    const supabase = createClientComponentClient();

    const fetchStats = useCallback(async () => {
      // Tidak set isLoading di sini agar refresh lebih mulus saat notifikasi
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        if (!res.ok) throw new Error('Gagal memuat data statistik dari server.');
        const data = await res.json();
        
        setStats({
          total_datasets: data.total_datasets ?? 0,
          total_requests: data.total_requests ?? 0,
          total_downloads: data.total_downloads ?? 0,
          unique_requesters: data.unique_requesters ?? 0,
        });

        setChartData({
          labels: (data.top_requests ?? []).map(item => item.requested_data),
          datasets: [{
            label: 'Jumlah Permintaan',
            data: (data.top_requests ?? []).map(item => item.request_count),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 5,
          }]
        });

      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
        fetchStats();

        // Pendengar untuk tabel 'data_requests'
        const requestsChannel = supabase
          .channel('realtime-data-requests')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'data_requests' },
            (payload) => {
              toast.success(`Permohonan data baru dari: ${payload.new.name}`);
              fetchStats(); // Refresh statistik
            }
          )
          .subscribe();
        
        // --- PENAMBAHAN: Pendengar untuk tabel 'feedback' ---
        const feedbackChannel = supabase
          .channel('realtime-feedback')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback' },
            (payload) => {
              toast.success(`Feedback baru dari: ${payload.new.name}`);
              // Kita bisa juga buat fungsi fetch terpisah untuk tabel feedback jika diperlukan
            }
          )
          .subscribe();
        
        // Cleanup function untuk menghentikan kedua pendengar
        return () => {
          supabase.removeChannel(requestsChannel);
          supabase.removeChannel(feedbackChannel);
        };
    }, [supabase, fetchStats]);

    // Fungsi untuk sinkronisasi data (Tidak Diubah)
    const handleSync = async () => {
      setIsSyncing(true);
      setSyncMessage({ type: 'info', text: 'Sinkronisasi sedang berjalan...' });
      try {
        const response = await fetch('/api/sync-sigi', { method: 'POST' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setSyncMessage({ type: 'success', text: result.message });
        fetchStats(); 
      } catch (err) {
        setSyncMessage({ type: 'error', text: `Gagal: ${err.message}` });
      } finally {
        setIsSyncing(false);
      }
    };

    if (error && isLoading) return <div className="text-center p-10 text-red-500">Terjadi Error: {error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isSyncing ? 'Memproses...' : 'Sinkronkan Data SIGI'}
                </button>
            </div>

            {syncMessage.text && (
              <div className={`p-4 mb-4 rounded-lg text-white ${
                syncMessage.type === 'success' ? 'bg-green-500' :
                syncMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                {syncMessage.text}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Dataset" value={isLoading ? '...' : stats.total_datasets} color="bg-purple-500" />
                <StatCard title="Total Permohonan Data" value={isLoading ? '...' : stats.total_requests} color="bg-blue-500" />
                <StatCard title="Total Unduhan" value={isLoading ? '...' : stats.total_downloads} color="bg-green-500" />
                <StatCard title="Pengguna Unik" value={isLoading ? '...' : stats.unique_requesters} color="bg-yellow-500" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Data Paling Sering Diminta</h3>
                <div className="relative h-96">
                    { isLoading ? <p className="text-center text-gray-500">Memuat data chart...</p> : <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} /> }
                </div>
            </div>

            <DataRequestTable />

            <FeedbackTable /> {/* <-- PENAMBAHAN 2 */}
        </>
    );
}