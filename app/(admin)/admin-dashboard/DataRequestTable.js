"use client";

import { useState, useEffect } from 'react';
import UpdateRequestModal from './UpdateRequestModal'; // <-- 1. Import komponen modal baru

// Komponen ini akan menjadi 'jantung' dari manajemen data
export default function DataRequestTable() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- PENAMBAHAN: State untuk mengontrol modal ---
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Fungsi untuk mengambil data dari API
    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        let apiUrl = `/api/admin/requests?status=${filter === 'all' ? '' : filter}`;
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('Gagal mengambil data permohonan.');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    // --- PENAMBAHAN: Fungsi untuk menangani update dan refresh data ---
    const handleUpdateRequest = () => {
        setSelectedRequest(null); // Tutup modal
        fetchRequests(); // Muat ulang data tabel agar update
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Manajemen Permohonan Data</h3>
                
                <div className="flex space-x-2 mb-4 border-b pb-2">
                    <FilterButton label="Semua" filterValue="all" activeFilter={filter} setFilter={setFilter} />
                    <FilterButton label="Pending" filterValue="pending" activeFilter={filter} setFilter={setFilter} />
                    <FilterButton label="In Progress" filterValue="in progress" activeFilter={filter} setFilter={setFilter} />
                    <FilterButton label="Done" filterValue="done" activeFilter={filter} setFilter={setFilter} />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instansi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr>
                            ) : requests.length > 0 ? (
                                requests.map(req => (
                                    // --- REVISI: Kirim prop untuk membuka modal ---
                                    <RequestRow key={req.id} request={req} onReviewClick={() => setSelectedRequest(req)} />
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-500">Tidak ada data untuk filter ini.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PENAMBAHAN: Tampilkan modal jika ada request yang dipilih --- */}
            {selectedRequest && (
                <UpdateRequestModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={handleUpdateRequest}
                />
            )}
        </>
    );
}

// --- REVISI: Komponen baris tabel sekarang menerima prop onReviewClick ---
function RequestRow({ request, onReviewClick }) {
    const getStatusClass = (status) => {
        if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
        if (status === 'in progress') return 'bg-blue-100 text-blue-800';
        if (status === 'done') return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{request.name}</div>
                <div className="text-sm text-gray-500">{request.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.agency}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                    {request.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString('id-ID')}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* --- REVISI: Hubungkan tombol ke fungsi onReviewClick --- */}
                <button onClick={onReviewClick} className="text-indigo-600 hover:text-indigo-900">Tinjau</button>
            </td>
        </tr>
    );
}

// Komponen kecil untuk tombol filter (Tidak Diubah)
const FilterButton = ({ label, filterValue, activeFilter, setFilter }) => (
    <button
        onClick={() => setFilter(filterValue)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            activeFilter === filterValue
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);