// File: app/(main)/detail/page.js
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { descriptions } from '@/lib/table_descriptions';

function DetailContent() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // State management
    const [columns, setColumns] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    const searchParams = useSearchParams();
    const tableName = searchParams.get('table');

    // Effect 1: Route guard for authorization
    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (!user) {
            router.push('/login-register');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // Effect 2: Fetching column data after authorization
    useEffect(() => {
        if (isAuthorized) { 
            if (!tableName) {
                setError("Nama tabel tidak ditemukan di URL.");
                setLoading(false);
                return;
            }

            setDescription(descriptions[tableName] || 'Deskripsi untuk tabel ini belum tersedia.');
            document.title = `Detail - ${tableName}`;
            
            setLoading(true);
            fetch(`/api/catalog/tables/${tableName}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || `Tabel "${tableName}" tidak dapat dimuat.`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    setColumns(data);
                })
                .catch(err => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [tableName, isAuthorized]);

    // Handler for the data request form submission
    const handleRequestSubmit = (event) => {
        event.preventDefault();
        const purpose = event.target.purpose.value;
        alert(`Simulasi Berhasil!\nPermintaan data untuk tabel "${tableName}" dengan keperluan "${purpose}" telah terkirim.`);
        setIsRequestModalOpen(false);
        event.target.reset();
    };

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-600">Memeriksa otorisasi...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-6 py-12">
                <Link href="/catalog" className="text-blue-600 hover:underline mb-6 inline-block">
                    &larr; Kembali ke Katalog
                </Link>
                <div className="bg-white p-8 rounded-xl shadow-md border">
                    {loading ? (
                        <p className="text-gray-600">Memuat struktur tabel dari database...</p>
                    ) : error ? (
                        <div>
                            <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
                            <p className="text-gray-600 mt-2">{error}</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Struktur Tabel</h2>
                                    <p className="font-mono text-lg mt-1 text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">{tableName}</p>
                                    <p className="text-gray-600 mt-3 text-sm max-w-2xl">{description}</p>
                                </div>
                                <button 
                                    onClick={() => setIsRequestModalOpen(true)}
                                    className="flex-shrink-0 w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                                    <span>Ajukan Permintaan Data</span>
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto mt-6">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase border-b">Nama Kolom</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase border-b">Tipe Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {columns.map((col) => (
                                            <tr key={col.column_name} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-800 font-mono">{col.column_name}</td>
                                                <td className="px-6 py-4 text-blue-800 font-mono">{col.formatted_data_type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div onClick={() => setIsRequestModalOpen(false)} className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity ${isRequestModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Formulir Permintaan Data</h2>
                        <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 text-3xl hover:text-gray-800">&times;</button>
                    </div>
                    <form onSubmit={handleRequestSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="request-table-name" className="block text-sm font-medium text-gray-700">Tabel Data</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" 
                                    value={tableName || ''} 
                                    readOnly 
                                />
                            </div>
                            <div>
                                <label htmlFor="request-purpose" className="block text-sm font-medium text-gray-700">Keperluan Data</label>
                                <textarea 
                                    id="request-purpose" 
                                    name="purpose"
                                    rows="4" 
                                    // PERUBAHAN DI SINI
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
                                    placeholder="Jelaskan untuk apa data ini akan digunakan..." 
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                Kirim Permintaan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default function DetailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-96"><p className="text-gray-600">Memuat halaman...</p></div>}>
            <DetailContent />
        </Suspense>
    );
}