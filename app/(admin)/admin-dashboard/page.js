"use client";

import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, BarElement, Tooltip, Legend );

const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
    },
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ apiCount: '...', columnCount: '...', schemaCount: '...' });
    const [schemaChartData, setSchemaChartData] = useState({ labels: [], datasets: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch('/api/admin/dashboard-stats')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Gagal mengambil data statistik dari server.');
                }
                return res.json();
            })
            .then(data => {
                setStats({
                    apiCount: data.stats.api_count,
                    columnCount: data.stats.column_count,
                    schemaCount: data.stats.schema_count,
                });
                setSchemaChartData({
                    labels: data.schemaCounts.map(s => s.schemaname),
                    datasets: [{
                        label: 'Jumlah API per Schema',
                        data: data.schemaCounts.map(s => s.count),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderRadius: 5,
                    }]
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error di halaman dashboard:', error);
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (error) {
        return <div className="text-center p-10 text-red-500">Terjadi Error: {error}</div>
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total API (Tabel Sigi)" value={isLoading ? '...' : stats.apiCount} color="bg-purple-500" />
                <StatCard title="Total Kolom Data" value={isLoading ? '...' : stats.columnCount} color="bg-blue-500" />
                <StatCard title="Total Sumber Data" value={isLoading ? '...' : stats.schemaCount} color="bg-yellow-500" />
                <StatCard title="Total Pengguna" value="42" color="bg-red-500" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">API per Sumber Data</h3>
                <div className="relative h-96">
                    { !isLoading && schemaChartData.labels.length > 0 ? (
                        <Bar options={chartOptions} data={schemaChartData} />
                    ) : (
                        <p className="text-center text-gray-500">Memuat data chart...</p>
                    )}
                </div>
            </div>
        </>
    );
}

const StatCard = ({ title, value, color }) => (
    <div className={`${color} text-white rounded-xl shadow-lg p-6 flex flex-col justify-between`}>
        <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    </div>
);