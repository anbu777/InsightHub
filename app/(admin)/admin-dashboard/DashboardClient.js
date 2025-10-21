// app/(admin)/admin-dashboard/DashboardClient.js

"use client";

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DataRequestTable from './DataRequestTable';
import FeedbackTable from './FeedbackTable';

ChartJS.register( CategoryScale, LinearScale, BarElement, Tooltip, Legend );

const StatCard = ({ title, value, color }) => (
    <div className={`${color} text-white rounded-xl shadow-lg p-6`}>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

export default function DashboardClient({ stats, topRequests, initialRequests, initialFeedback, syncAction, initialRequestStatusFilter }) {
    const [isSyncing, startSyncTransition] = useTransition();

    console.log("--- Data received by Client ---");
    console.log("Initial Requests:", initialRequests);
    console.log("Initial Feedback:", initialFeedback);
    console.log("-----------------------------");
    // === AKHIR TAMBAHAN ===
    
    const chartData = {
        labels: topRequests.map(item => item.requested_data),
        datasets: [{
            label: 'Jumlah Permintaan',
            data: topRequests.map(item => item.request_count),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 5,
        }]
    };

    const handleSync = () => {
        startSyncTransition(async () => {
            const result = await syncAction();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Dataset" value={stats.total_datasets} color="bg-purple-500" />
                <StatCard title="Total Permohonan Data" value={stats.total_requests} color="bg-blue-500" />
                <StatCard title="Total Dilihat" value={stats.total_downloads} color="bg-green-500" />
                <StatCard title="Pengguna Unik" value={stats.unique_requesters} color="bg-yellow-500" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Data Paling Sering Diminta</h3>
                <div className="relative h-96">
                    <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                </div>
            </div>

            <DataRequestTable 
                initialRequests={initialRequests} 
                initialStatusFilter={initialRequestStatusFilter}
            />

            <FeedbackTable initialFeedback={initialFeedback} />
        </>
    );
}