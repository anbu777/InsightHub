// app/(main)/detail/[id]/DetailClientComponent.js

"use client";

import { useState } from 'react';
import Papa from 'papaparse'; // BARU: Impor library untuk konversi CSV

// BARU: Fungsi helper untuk memicu unduhan di browser
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Komponen ini menerima data dari Server Component sebagai props
export default function DetailClientComponent({ dataset }) {
    const [activeTab, setActiveTab] = useState('metadata');
    
    // BARU: State untuk mengelola UI unduhan
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    // BARU: Fungsi utama untuk menangani proses unduhan
    const handleDownload = async (format) => {
        setIsDownloading(true);
        setDownloadError(null);
        setIsDownloadOpen(false);

        // Validasi jika URL endpoint tidak ada
        if (!dataset.data_url) {
            setDownloadError("URL Endpoint untuk unduhan tidak tersedia.");
            setIsDownloading(false);
            return;
        }

        try {
            // 1. Ambil seluruh data dari API endpoint
            const response = await fetch(dataset.data_url);
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: Status ${response.status}`);
            }
            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error("Tidak ada data untuk diunduh.");
            }

            const filename = `${dataset.title.replace(/\s+/g, '_')}.${format}`;
            let fileContent;

            // 2. Konversi data ke format yang dipilih
            if (format === 'csv') {
                fileContent = Papa.unparse(data);
            } else { // format === 'json'
                fileContent = JSON.stringify(data, null, 2);
            }

            // 3. Panggil helper untuk memicu unduhan
            const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
            downloadFile(filename, fileContent, mimeType);

        } catch (error) {
            console.error("Download failed:", error);
            setDownloadError(error.message);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="bg-white p-8 rounded-xl shadow-md border">
                {/* Bagian Header Informasi */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{dataset.title}</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-blue-600 bg-blue-100">
                                {dataset.categories?.nama_kategori || 'UMUM'}
                            </span>
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-100">
                                {dataset.unors?.nama_unor || 'TIDAK DIKETAHUI'}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm max-w-3xl">{dataset.description}</p>
                    </div>

                    {/* DIUBAH: Tombol Permintaan diganti dengan Dropdown Unduh */}
                    <div className="relative flex-shrink-0 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                            disabled={isDownloading}
                            className="w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isDownloading ? 'Mengunduh...' : 'Unduh Data'}
                            <svg className={`w-4 h-4 ml-2 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>

                        {isDownloadOpen && (
                            <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border">
                                <button onClick={() => handleDownload('json')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai JSON</button>
                                <button onClick={() => handleDownload('csv')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai CSV</button>
                            </div>
                        )}
                        {downloadError && <p className="text-xs text-red-500 mt-2">{downloadError}</p>}
                    </div>
                </div>
                
                {/* Navigasi Tab (Tidak ada perubahan di sini) */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('metadata')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'metadata' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Metadata
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Preview Data
                        </button>
                         <button
                            onClick={() => setActiveTab('endpoint')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'endpoint' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            API Endpoint
                        </button>
                    </nav>
                </div>

                {/* Konten Tab (Tidak ada perubahan di sini) */}
                <div>
                    {activeTab === 'metadata' && (
                        <div className="bg-gray-800 text-white rounded-lg p-1">
                            <pre className="h-full max-h-[500px] w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">
                                {JSON.stringify(dataset.metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                    {activeTab === 'preview' && (
                         <div className="bg-gray-800 text-white rounded-lg p-1">
                            <p className="text-xs text-gray-400 p-2">Menampilkan contoh data yang tersedia.</p>
                            <pre className="h-full max-h-[500px] w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">
                                {dataset.sample_data ? JSON.stringify(dataset.sample_data, null, 2) : "Sample data tidak tersedia."}
                            </pre>
                        </div>
                    )}
                    {activeTab === 'endpoint' && (
                        <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-sm text-gray-700 mb-2">Gunakan URL berikut untuk mengakses data melalui API:</p>
                             <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                                <code>{dataset.data_url || "URL Endpoint tidak tersedia."}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Permintaan Data sudah dihapus */}
        </>
    );
}