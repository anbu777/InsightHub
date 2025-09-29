// WAJIB: Ini adalah Client Component
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// GANTI: Import Chart.js dan komponen React Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// GANTI: Kita harus mendaftarkan komponen Chart.js yang akan kita gunakan
ChartJS.register( CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend );

// Opsi default untuk charts
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

export default function AdminDashboardPage() {
    // --- GANTI: Kita gunakan State untuk SEMUANYA ---
    const [stats, setStats] = useState({
        apiCount: '...',
        columnCount: '...',
        unorCount: '...',
        kategoriCount: '...',
        avgCols: '...',
        withDesc: '...'
    });
    const [recentApis, setRecentApis] = useState([]); // Untuk tabel
    
    // State khusus untuk data chart
    const [unorChartData, setUnorChartData] = useState({
        labels: [],
        datasets: [{ label: 'Jumlah API', data: [], backgroundColor: 'rgba(59, 130, 246, 0.7)' }]
    });
    const [kategoriChartData, setKategoriChartData] = useState({
        labels: [],
        datasets: [{ label: 'Komposisi', data: [], backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'] }]
    });

    // --- Efek ini berjalan sekali (seperti DOMContentLoaded) untuk mengambil data ---
    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) return;

                // 1. Proses Data untuk KPI Statistik
                const totalApi = data.length;
                const totalKolom = data.reduce((acc, table) => acc + (table.kolom ? table.kolom.length : 0), 0);
                const unors = new Set(data.map(item => item.unor));
                const kategori = new Set(data.map(item => item.kategori));
                const avgCols = (totalKolom / totalApi).toFixed(1);
                const withDesc = data.filter(item => item.deskripsi && item.deskripsi.length > 0).length;
                const withDescPercent = ((withDesc / totalApi) * 100).toFixed(0) + '%';
                
                // GANTI: Set semua statistik ke dalam state
                setStats({
                    apiCount: totalApi,
                    columnCount: totalKolom,
                    unorCount: unors.size,
                    kategoriCount: kategori.size,
                    avgCols: avgCols,
                    withDesc: withDescPercent
                });

                // 2. Proses Data untuk Diagram UNOR (Bar Chart)
                const unorCounts = data.reduce((acc, item) => {
                    acc[item.unor] = (acc[item.unor] || 0) + 1;
                    return acc;
                }, {});
                setUnorChartData({
                    labels: Object.keys(unorCounts),
                    datasets: [{
                        label: 'Jumlah API',
                        data: Object.values(unorCounts),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)'
                    }]
                });

                // 3. Proses Data untuk Diagram Kategori (Pie Chart)
                const kategoriCounts = data.reduce((acc, item) => {
                    acc[item.kategori] = (acc[item.kategori] || 0) + 1;
                    return acc;
                }, {});
                setKategoriChartData({
                    labels: Object.keys(kategoriCounts),
                    datasets: [{
                        label: 'Komposisi',
                        data: Object.values(kategoriCounts),
                        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(255, 99, 132, 0.7)']
                    }]
                });

                // 4. Proses Data untuk Tabel Aktivitas Terbaru
                setRecentApis(data.slice(-5).reverse());
            })
            .catch(error => console.error('Error memuat data dashboard:', error));
    }, []); // Array dependensi kosong, jalankan sekali saja

    // --- RENDER JSX ---
    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <header className="bg-gray-800 text-white shadow-lg z-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Image src="/LogoInsight.png" alt="Logo PUPR" width={80} height={80} className="h-20 w-auto" />
                        <span className="text-xl font-semibold hidden sm:block">Admin Dashboard</span>
                    </div>
                    <nav className="flex items-center space-x-6 text-sm sm:text-base">
                        <Link href="#" className="font-semibold text-white border-b-2 border-blue-400 pb-1">Dashboard</Link>
                        {/* ... (Link Nav lainnya) ... */}
                        <Link href="/role-selection" className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                            Logout
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 flex-grow">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Selamat Datang, Admin</h1>

                {/* Grid Statistik KPI (GANTI: Data diambil dari state) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        {/* ... SVG ... */}
                        <div><div className="text-3xl font-bold text-gray-800">{stats.apiCount}</div><div className="text-sm text-gray-500">Total API</div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        {/* ... SVG ... */}
                        <div><div className="text-3xl font-bold text-gray-800">{stats.columnCount}</div><div className="text-sm text-gray-500">Total Kolom Data</div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        {/* ... SVG ... */}
                        <div><div className="text-3xl font-bold text-gray-800">{stats.unorCount}</div><div className="text-sm text-gray-500">Unit Organisasi</div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        {/* ... SVG ... */}
                        <div><div className="text-3xl font-bold text-gray-800">{stats.kategoriCount}</div><div className="text-sm text-gray-500">Sumber Data</div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                        {/* ... SVG ... */}
                        <div><div className="text-3xl font-bold text-gray-800">42</div> <div className="text-sm text-gray-500">Total Pengguna</div></div>
                    </div>
                </div>

                {/* Grid Charts (GANTI: <canvas> diganti dengan komponen <Bar> dan <Pie>) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">API per Unit Organisasi (UNOR)</h3>
                        <div className="relative h-96">
                            <Bar options={chartOptions} data={unorChartData} />
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Komposisi Kategori</h3>
                        <div className="relative h-96">
                            <Pie options={chartOptions} data={kategoriChartData} />
                        </div>
                    </div>
                </div>

                {/* Grid Tabel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ... Tabel Permintaan Data (Statis) ... */}
                    <div className="bg-white rounded-xl shadow-md border">
                        <h3 className="text-xl font-semibold text-gray-800 p-6 border-b">Permintaan Data Masuk (Contoh)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                {/* ... thead ... */}
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 ...">budi.sda@pu.go.id</td>
                                        <td className="px-6 py-4 ...">tabel_data_bendungan</td>
                                        <td className="px-6 py-4"><span className="... text-yellow-800 bg-yellow-100">Pending</span></td>
                                        <td className="px-6 py-4 space-x-2">
                                            <Link href="#" className="... bg-green-500">Setuju</Link>
                                            <Link href="#" className="... bg-red-500">Tolak</Link>
                                        </td>
                                    </tr>
                                    {/* ... baris lainnya ... */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* GANTI: Tabel dinamis sekarang di-render menggunakan .map() dari state */}
                    <div className="bg-white rounded-xl shadow-md border">
                        <h3 className="text-xl font-semibold text-gray-800 p-6 border-b">API Baru Ditambahkan</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 ...">Nama Tabel</th>
                                        <th className="px-6 py-3 ...">UNOR</th>
                                        <th className="px-6 py-3 ...">Kategori</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentApis.map((api) => (
                                        <tr key={api.table_name} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{api.table_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{api.unor.toUpperCase()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${api.kategori === 'EHRM' ? 'text-indigo-800 bg-indigo-100' : 'text-green-800 bg-green-100'}`}>
                                                    {api.kategori}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentApis.length === 0 && (
                                        <tr><td colSpan="3" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Grid Aksi Cepat & Info Lain (GANTI: Data diambil dari state) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-1 space-y-6">
                        {/* ... Aksi Cepat ... */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Kualitas Data (Contoh)</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between"><span>Rata-rata Kolom per API:</span> <span className="font-bold text-gray-800">{stats.avgCols}</span></li>
                                <li className="flex justify-between"><span>API dengan Deskripsi:</span> <span className="font-bold text-gray-800">{stats.withDesc}</span></li>
                            </ul>
                        </div>
                    </div>
                    {/* ... Log Aktivitas ... */}
                </div>
            </main>

            <footer className="bg-gray-800 text-white mt-12">
                {/* ... footer content ... */}
            </footer>
        </div>
    );
}