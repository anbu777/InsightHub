"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { descriptions } from '@/lib/table_descriptions';

// Komponen baru untuk menampilkan preview data JSON
function DataPreviewer({ tableName }) {
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tableName) {
            setIsLoading(true);
            setError(null);
            fetch(`/api/explorer/${tableName}?requestType=data&limit=3`)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => {
                    setPreviewData(data);
                })
                .catch(async (res) => {
                    try {
                        const err = await res.json();
                        setError(err.message || 'Gagal memuat preview data.');
                    } catch {
                        setError('Gagal memuat preview data.');
                    }
                })
                .finally(() => setIsLoading(false));
        }
    }, [tableName]);

    if (isLoading) {
        return <p className="text-sm text-gray-500">Memuat preview data...</p>;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    if (!previewData || previewData.length === 0) {
        return <p className="text-sm text-gray-500">Tidak ada data untuk ditampilkan sebagai preview.</p>;
    }

    return (
        <div className="bg-gray-800 text-white rounded-lg h-full p-1 flex-grow min-h-[300px]">
            <pre className="h-full w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">
                {JSON.stringify(previewData, null, 2)}
            </pre>
        </div>
    );
}


function DetailContent() {
    // State baru untuk mengelola tab aktif
    const [activeTab, setActiveTab] = useState('struktur');

    const [columns, setColumns] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    const searchParams = useSearchParams();
    const tableName = searchParams.get('table');

    useEffect(() => {
        if (tableName) {
            try {
                const popularityData = JSON.parse(localStorage.getItem('apiPopularity')) || {};
                popularityData[tableName] = (popularityData[tableName] || 0) + 1;
                localStorage.setItem('apiPopularity', JSON.stringify(popularityData));
            } catch (e) {
                console.error("Gagal memperbarui data popularitas:", e);
            }
        }
    }, [tableName]);

    useEffect(() => {
        if (tableName) {
            setLoading(true);
            fetch(`/api/catalog/tables/${tableName}`)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => setColumns(data))
                .catch(() => setError(`Tabel "${tableName}" tidak dapat dimuat.`))
                .finally(() => setLoading(false));
            setDescription(descriptions[tableName] || 'Deskripsi untuk tabel ini belum tersedia.');
        }
    }, [tableName]);

    const handleRequestSubmit = (event) => {
        event.preventDefault();
        const purpose = event.target.purpose.value;
        const format = event.target.format.value;
        const userEmail = 'user.umum@example.com';
        const requestText = `
--- Permintaan Data ---
User Email: ${userEmail}
Nama Tabel: ${tableName}
Format File: ${format.toUpperCase()}
Keperluan:
${purpose}
--------------------
        `;
        navigator.clipboard.writeText(requestText.trim())
            .then(() => {
                alert('Teks Permintaan Berhasil Disalin!\n\nSilakan kirim (paste) teks ini ke admin melalui email atau aplikasi chat.');
            })
            .catch(err => {
                console.error('Gagal menyalin teks: ', err);
                alert('Gagal menyalin teks secara otomatis. Mohon salin secara manual.');
            });
        setIsRequestModalOpen(false);
        event.target.reset();
    };

    return (
        <>
            <div className="container mx-auto px-6 py-12">
                <Link href="/catalog" className="text-[#0D2A57] hover:underline mb-6 inline-block">
                    ← Kembali ke Katalog
                </Link>
                <div className="bg-white p-8 rounded-xl shadow-md border">
                    {loading ? (
                        <p className="text-gray-600">Memuat detail tabel...</p>
                    ) : error ? (
                        <div>
                            <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
                            <p className="text-gray-600 mt-2">{error}</p>
                        </div>
                    ) : (
                        <div>
                            {/* Bagian Header Informasi */}
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Detail Data</h2>
                                    <p className="font-mono text-lg mt-1 text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">{tableName}</p>
                                    <p className="text-gray-600 mt-3 text-sm max-w-2xl">{description}</p>
                                </div>
                                <button 
                                    onClick={() => setIsRequestModalOpen(true)}
                                    className="flex-shrink-0 w-full sm:w-auto bg-[#FFD100] text-[#0D2A57] font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">
                                    Ajukan Permintaan Data
                                </button>
                            </div>
                            
                            {/* Navigasi Tab */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('struktur')}
                                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'struktur' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Struktur Data (Metadata)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('preview')}
                                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Preview Data
                                    </button>
                                </nav>
                            </div>

                            {/* Konten Tab */}
                            <div>
                                {activeTab === 'struktur' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase border-b">Nama Kolom</th>
                                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase border-b">Tipe Data</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {columns.map((col) => (
                                                    <tr key={col.column_name} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-semibold text-gray-800 font-mono">{col.column_name}</td>
                                                        <td className="px-6 py-4 text-[#0D2A57] font-mono">{col.formatted_data_type}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 'preview' && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Menampilkan 3 baris pertama sebagai contoh.</p>
                                        <DataPreviewer tableName={tableName} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div onClick={() => setIsRequestModalOpen(false)} className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${isRequestModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Formulir Permintaan Data</h2>
                    <form onSubmit={handleRequestSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tabel Data</label>
                                <input type="text" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" value={tableName || ''} readOnly />
                            </div>
                            <div>
                                <label htmlFor="request-purpose" className="block text-sm font-medium text-gray-700">Keperluan Data</label>
                                <textarea id="request-purpose" name="purpose" rows="3" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900" required></textarea>
                            </div>
                            <div>
                                <label htmlFor="request-format" className="block text-sm font-medium text-gray-700">Format Output</label>
                                <select id="request-format" name="format" defaultValue="csv" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
                                    <option value="csv">CSV</option>
                                    <option value="json">JSON</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors">
                                Salin Teks Permintaan
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
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <DetailContent />
        </Suspense>
    );
}