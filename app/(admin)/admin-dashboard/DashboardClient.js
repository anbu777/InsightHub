// app/(admin)/admin-dashboard/DashboardClient.js
"use client";

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
// BARU: Impor ArcElement dan Pie chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2'; // Impor Pie
// HAPUS: import Link from 'next/link';
// HAPUS: import { FaExternalLinkAlt } from 'react-icons/fa';

// BARU: Komponen SVG inline sebagai pengganti FaExternalLinkAlt
const FaExternalLinkAlt = ({ size = 12, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);


// Komponen tabel preview (RecentRequestsPreview, RecentFeedbackPreview - Tidak Diubah)
function RecentRequestsPreview({ requests }) {
    if (!requests || requests.length === 0) {
        return <p className="text-gray-500 text-center py-4">Belum ada permintaan data baru.</p>;
    }
    const previewData = requests.slice(0, 5);
    const getStatusClass = (status) => {
        if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
        if (status === 'approved') return 'bg-green-100 text-green-800';
        if (status === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map(req => (
                        <tr key={req.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{req.user_name}</div>
                                <div className="text-sm text-gray-500">{req.user_email}</div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                {/* ================== PERBAIKAN DI SINI ================== */}
                                {/* Menggunakan backtick (`) untuk template literal */}
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(req.status)}`}>
                                {/* ======================================================= */}
                                    {req.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
function RecentFeedbackPreview({ feedback }) {
    if (!feedback || feedback.length === 0) {
        return <p className="text-gray-500 text-center py-4">Belum ada feedback baru.</p>;
    }
     const previewData = feedback.slice(0, 5);
     const getEmojiForRating = (rating) => { 
        const emojis = ['😡', '☹️', '😐', '🙂', '😄'];
        if (rating >= 0 && rating < emojis.length) {
            return emojis[rating];
        }
        return '❓';
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saran Singkat</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map(item => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.user_name}</div>
                            </td>
                            <td className="px-4 py-2 whitespace-normal text-sm text-gray-700 max-w-xs truncate">{item.suggestion || '-'}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-center text-xl">{getEmojiForRating(item.rating)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// Daftarkan elemen Pie/Doughnut
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, color }) => ( /* ... (StatCard tetap sama) ... */
    // ================== PERBAIKAN DI SINI (Kesalahan serupa) ==================
    // Menggunakan backtick (`) untuk template literal
    <div className={`${color} text-white rounded-xl shadow-lg p-6`}>
    {/* ======================================================================== */}
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

// Komponen Utama Dashboard Client (Direvisi)
export default function DashboardClient({
    stats,
    topRequests,
    initialRequests,
    initialFeedback,
    syncAction,
    // BARU: Terima data untuk chart baru
    categoryDistributionData,
    unorDistributionData,
    feedbackDistributionData
}) {
    const [isSyncing, startSyncTransition] = useTransition();

    // Data untuk chart Top 5 Requests (Tetap Sama)
    const topRequestsChartData = {
        labels: topRequests.map(item => item.requested_data),
        datasets: [{ /* ... */
            label: 'Jumlah Permintaan',
            data: topRequests.map(item => item.request_count),
            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Biru
            borderRadius: 5,
        }]
    };

    // === DATA BARU UNTUK CHART ===
    // 1. Data Chart Kategori (Pie)
    const categoryChartData = {
        labels: categoryDistributionData.map(item => item.name),
        datasets: [{
            label: 'Jumlah Katalog',
            data: categoryDistributionData.map(item => item.count),
            backgroundColor: [ // Sediakan warna yang cukup
                'rgba(168, 85, 247, 0.7)', // Purple
                'rgba(239, 68, 68, 0.7)',  // Red
                'rgba(16, 185, 129, 0.7)', // Emerald
                'rgba(245, 158, 11, 0.7)', // Amber
                'rgba(99, 102, 241, 0.7)', // Indigo
                'rgba(236, 72, 153, 0.7)', // Pink
            ],
            borderColor: [
                'rgba(255, 255, 255, 1)',
            ],
            borderWidth: 1,
        }]
    };

    // 2. Data Chart UNOR (Bar)
    const unorChartData = {
        labels: unorDistributionData.map(item => item.name),
        datasets: [{
            label: 'Jumlah Katalog',
            data: unorDistributionData.map(item => item.count),
            backgroundColor: 'rgba(16, 185, 129, 0.7)', // Hijau Emerald
            borderRadius: 5,
        }]
    };

    // 3. Data Chart Feedback (Pie)
    const feedbackChartData = {
        labels: feedbackDistributionData.labels,
        datasets: [{
            label: 'Jumlah Feedback',
            data: feedbackDistributionData.counts,
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)',  // Merah (Marah)
                'rgba(249, 115, 22, 0.7)', // Oranye (Sedih)
                'rgba(245, 158, 11, 0.7)', // Kuning (Netral)
                'rgba(132, 204, 22, 0.7)', // Lime (Senyum)
                'rgba(34, 197, 94, 0.7)',  // Hijau (Senang)
            ],
            borderColor: [
                'rgba(255, 255, 255, 1)',
            ],
            borderWidth: 1,
        }]
    };
    // === AKHIR DATA BARU ===


    const handleSync = () => { /* ... (handleSync tetap sama) ... */
        startSyncTransition(async () => {
            const result = await syncAction();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    // Opsi umum untuk chart (agar tidak berulang)
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top', // Pindahkan legenda ke atas
            },
        },
    };
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right', // Legenda Pie di kanan
            },
        },
    };


    return (
        // AWAL DARI BLOK YANG DIPERBAIKI (MENGGABUNGKAN KONFLIK)
        // Gunakan grid untuk layout yang lebih fleksibel
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    // Menggunakan styling lengkap dari versi HEAD
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {/* Menggunakan teks dari versi d12b2a4... */}
                    {isSyncing ? 'Memproses...' : 'Sinkronkan Data SIGI'}
                </button>
            </div>
            {/* AKHIR DARI BLOK YANG DIPERBAIKI */}
            
            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Dataset" value={stats.total_datasets} color="bg-purple-500" />
                <StatCard title="Total Permohonan" value={stats.total_requests} color="bg-blue-500" />
                <StatCard title="Total Dilihat" value={stats.total_downloads} color="bg-green-500" />
                <StatCard title="Pemohon Unik" value={stats.unique_requesters} color="bg-yellow-500" />
            </div>

            {/* === BAGIAN CHART BARU === */}
            {/* Buat grid untuk menata chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Chart Top 5 Requests */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Data Diminta</h3>
                    <div className="relative h-96">
                        <Bar options={commonChartOptions} data={topRequestsChartData} />
                    </div>
                </div>

                {/* Chart Distribusi Kategori */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Distribusi Katalog per Kategori</h3>
                    <div className="relative h-96">
                        {/* Gunakan Pie atau Doughnut */}
                        <Pie options={pieChartOptions} data={categoryChartData} />
                    </div>
                </div>

                {/* Chart Jumlah Katalog per UNOR */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Jumlah Katalog per Unit Organisasi</h3>
                    <div className="relative h-96">
                        <Bar options={{ ...commonChartOptions, indexAxis: 'y' }} data={unorChartData} /> {/* indexAxis: 'y' untuk bar horizontal */}
                    </div>
                </div>

                {/* Chart Distribusi Rating Feedback */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Distribusi Rating Kepuasan</h3>
                    <div className="relative h-96">
                        <Pie options={pieChartOptions} data={feedbackChartData} />
                    </div>
                </div>

            </div>
            {/* === AKHIR BAGIAN CHART BARU === */}


            {/* Preview Permintaan */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Permintaan Data Terbaru</h3>
                    {/* MENGGANTI: Link ke <a> */}
                    <a href="/requests" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        Lihat Semua <FaExternalLinkAlt size={12} />
                    </a>
                </div>
                <RecentRequestsPreview requests={initialRequests} />
            </div>

            {/* Preview Feedback */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Feedback Terbaru</h3>
                    {/* MENGGANTI: Link ke <a> */}
                    <a href="/feedback" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        Lihat Semua <FaExternalLinkAlt size={12} />
                    </a>
                </div>
                <RecentFeedbackPreview feedback={initialFeedback} />
            </div>
        </div>
    );
}