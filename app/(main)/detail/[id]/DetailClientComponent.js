// app/(main)/detail/[id]/DetailClientComponent.js

"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
// --- MODIFIKASI: Perbaiki path import ---
import { incrementClickCount } from '../../actions'; // Path harusnya ../../actions
// --- BATAS MODIFIKASI ---

// Fungsi helper downloadFile (Tetap Sama)
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

// Komponen Client Component
export default function DetailClientComponent({ dataset }) {
    const [activeTab, setActiveTab] = useState('metadata');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    // useEffect untuk memanggil incrementClickCount (Kode ini sudah benar)
    useEffect(() => {
        if (dataset && dataset.id) {
            incrementClickCount(dataset.id).catch(error => {
                console.error("Failed to increment click count:", error);
            });
        }
    }, [dataset]); // Gunakan dependency [dataset]

    // Fungsi handleDownload (Tetap Sama)
    const handleDownload = async (format) => {
        setIsDownloading(true);
        setDownloadError(null);
        setIsDownloadOpen(false);
        if (!dataset.data_url) {
            setDownloadError("URL Endpoint untuk unduhan tidak tersedia.");
            setIsDownloading(false);
            return;
        }
        try {
            const response = await fetch(dataset.data_url);
            if (!response.ok) { throw new Error(`Gagal mengambil data: Status ${response.status}`); }
            const data = await response.json();
            if (!data || (Array.isArray(data) && data.length === 0)) { // Perbaikan: Cek jika array kosong juga
                 throw new Error("Tidak ada data untuk diunduh.");
            }
            const filename = `${dataset.title ? dataset.title.replace(/\s+/g, '_') : 'dataset'}.${format}`; // Fallback filename
            let fileContent;
            if (format === 'csv') {
                 // Pastikan data adalah array of objects untuk unparse
                 if (!Array.isArray(data)) { throw new Error("Data tidak dalam format yang bisa diubah ke CSV."); }
                fileContent = Papa.unparse(data);
             }
            else { fileContent = JSON.stringify(data, null, 2); }
            const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
            downloadFile(filename, fileContent, mimeType);
        } catch (error) {
            console.error("Download failed:", error);
            setDownloadError(error.message);
        } finally {
            setIsDownloading(false);
        }
    };


    // JSX Return (Tetap Sama)
    return (
        <>
            <div className="bg-white p-8 rounded-xl shadow-md border">
                {/* Bagian Header Informasi */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{dataset.title || 'Judul Tidak Tersedia'}</h2> {/* Fallback Title */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-blue-600 bg-blue-100">
                                {dataset.categories?.nama_kategori || 'UMUM'}
                            </span>
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-100">
                                {dataset.unors?.nama_unor || 'TIDAK DIKETAHUI'}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm max-w-3xl">{dataset.description || 'Deskripsi tidak tersedia.'}</p> {/* Fallback Desc */}
                    </div>

                    {/* Dropdown Unduh */}
                    <div className="relative flex-shrink-0 w-full sm:w-auto">
                        <button
                            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                            disabled={isDownloading || !dataset.data_url} // Disable jika URL tidak ada
                            className="w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" // Cursor not-allowed
                        >
                            {isDownloading ? 'Mengunduh...' : 'Unduh Data'}
                            <svg className={`w-4 h-4 ml-2 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {isDownloadOpen && dataset.data_url && ( // Hanya tampilkan jika URL ada
                            <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border">
                                <button onClick={() => handleDownload('json')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai JSON</button>
                                <button onClick={() => handleDownload('csv')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai CSV</button>
                            </div>
                        )}
                        {downloadError && <p className="text-xs text-red-500 mt-2">{downloadError}</p>}
                    </div>
                </div>

                {/* Navigasi Tab */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('metadata')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'metadata' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > Metadata </button>
                        <button onClick={() => setActiveTab('preview')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > Preview Data </button>
                         <button onClick={() => setActiveTab('endpoint')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'endpoint' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > API Endpoint </button>
                    </nav>
                </div>

                {/* Konten Tab */}
                <div>
                    {activeTab === 'metadata' && (
                        <div className="bg-gray-800 text-white rounded-lg p-1">
                            <pre className="h-full max-h-[500px] w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">
                                {dataset.metadata ? JSON.stringify(dataset.metadata, null, 2) : "Metadata tidak tersedia."}
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
        </>
    );
}