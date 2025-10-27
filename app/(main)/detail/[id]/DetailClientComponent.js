// app/(main)/detail/[id]/DetailClientComponent.js

"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { incrementClickCount } from '../../actions'; // Path Server Action

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

    // --- TAMBAHAN: State untuk tombol Salin ---
    const [copyStatus, setCopyStatus] = useState('Salin'); // Teks awal tombol

    // useEffect untuk incrementClickCount (Tetap Sama)
    useEffect(() => {
        if (dataset && dataset.id) {
            incrementClickCount(dataset.id).catch(error => {
                console.error("Failed to increment click count:", error);
            });
        }
    }, [dataset]);

    // Fungsi handleDownload (Tetap Sama)
    const handleDownload = async (format) => {
        setIsDownloading(true);
        setDownloadError(null);
        setIsDownloadOpen(false);
        if (!dataset.data_url) {
            setDownloadError("URL Endpoint untuk unduhan tidak tersedia.");
            setIsDownloading(false); return;
        }
        try {
            const response = await fetch(dataset.data_url);
            if (!response.ok) { throw new Error(`Gagal mengambil data: Status ${response.status}`); }
            const data = await response.json();
            if (!data || (Array.isArray(data) && data.length === 0)) { throw new Error("Tidak ada data untuk diunduh."); }
            const filename = `${dataset.title ? dataset.title.replace(/\s+/g, '_') : 'dataset'}.${format}`;
            let fileContent;
            if (format === 'csv') {
                if (!Array.isArray(data)) { throw new Error("Data tidak dalam format yang bisa diubah ke CSV."); }
                fileContent = Papa.unparse(data);
            } else { fileContent = JSON.stringify(data, null, 2); }
            const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
            downloadFile(filename, fileContent, mimeType);
        } catch (error) {
            console.error("Download failed:", error);
            setDownloadError(error.message);
        } finally {
            setIsDownloading(false);
        }
    };

    // --- TAMBAHAN: Fungsi untuk menyalin URL API ---
    const handleCopyUrl = () => {
        const urlToCopy = dataset.data_url;
        if (!urlToCopy) return;

        // Gunakan metode document.execCommand untuk kompatibilitas iframe
        const textArea = document.createElement('textarea');
        textArea.value = urlToCopy;
        textArea.style.position = 'fixed'; // Hindari scroll jump
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyStatus('Disalin!'); // Beri feedback
                setTimeout(() => setCopyStatus('Salin'), 2000); // Kembali ke teks awal setelah 2 detik
            } else {
                 setCopyStatus('Gagal');
                 setTimeout(() => setCopyStatus('Salin'), 2000);
                 console.error('Gagal menyalin URL (execCommand)');
            }
        } catch (err) {
            setCopyStatus('Error');
            setTimeout(() => setCopyStatus('Salin'), 2000);
            console.error('Error saat menyalin URL:', err);
        }
        document.body.removeChild(textArea);
    };
    // --- BATAS TAMBAHAN ---


    // JSX Return
    return (
        <>
            <div className="bg-white p-8 rounded-xl shadow-md border">
                {/* Bagian Header Informasi (Tetap Sama)*/}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{dataset.title || 'Judul Tidak Tersedia'}</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-blue-600 bg-blue-100">{dataset.categories?.nama_kategori || 'UMUM'}</span>
                            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-100">{dataset.unors?.nama_unor || 'TIDAK DIKETAHUI'}</span>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm max-w-3xl">{dataset.description || 'Deskripsi tidak tersedia.'}</p>
                    </div>
                    {/* Dropdown Unduh (Tetap Sama) */}
                    <div className="relative flex-shrink-0 w-full sm:w-auto">
                        <button onClick={() => setIsDownloadOpen(!isDownloadOpen)} disabled={isDownloading || !dataset.data_url} className="w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" > {isDownloading ? 'Mengunduh...' : 'Unduh Data'} <svg className={`w-4 h-4 ml-2 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg> </button>
                        {isDownloadOpen && dataset.data_url && ( <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border"> <button onClick={() => handleDownload('json')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai JSON</button> <button onClick={() => handleDownload('csv')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">sebagai CSV</button> </div> )}
                        {downloadError && <p className="text-xs text-red-500 mt-2">{downloadError}</p>}
                    </div>
                </div>

                {/* Navigasi Tab (Tetap Sama) */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs"> {/* Tambah overflow-x-auto */}
                        <button onClick={() => setActiveTab('metadata')} className={`flex-shrink-0 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'metadata' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > Metadata </button>
                        <button onClick={() => setActiveTab('preview')} className={`flex-shrink-0 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > Preview Data </button>
                         <button onClick={() => setActiveTab('endpoint')} className={`flex-shrink-0 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'endpoint' ? 'border-[#0D2A57] text-[#0D2A57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} > API Endpoint </button>
                    </nav>
                </div>

                {/* Konten Tab */}
                <div>
                    {/* Tab Metadata & Preview (Tetap Sama) */}
                    {activeTab === 'metadata' && ( <div className="bg-gray-800 text-white rounded-lg p-1"> <pre className="h-full max-h-[500px] w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">{dataset.metadata ? JSON.stringify(dataset.metadata, null, 2) : "Metadata tidak tersedia."}</pre> </div> )}
                    {activeTab === 'preview' && ( <div className="bg-gray-800 text-white rounded-lg p-1"> <p className="text-xs text-gray-400 p-2">Menampilkan contoh data yang tersedia.</p> <pre className="h-full max-h-[500px] w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">{dataset.sample_data ? JSON.stringify(dataset.sample_data, null, 2) : "Sample data tidak tersedia."}</pre> </div> )}

                    {/* --- MODIFIKASI: Tab API Endpoint --- */}
                    {activeTab === 'endpoint' && (
                        <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-sm text-gray-700 mb-2">Gunakan URL berikut untuk mengakses data melalui API:</p>
                            {/* Wrapper untuk URL dan Tombol Salin */}
                            <div className="relative flex items-center gap-2 bg-gray-800 p-4 rounded">
                                {/* URL Endpoint */}
                                <pre className="flex-grow text-sm text-green-400 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                     {/* Tambahkan Link (a tag) */}
                                     {dataset.data_url ? (
                                        <a href={dataset.data_url}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="hover:underline break-all" // break-all untuk URL panjang
                                        >
                                            <code>{dataset.data_url}</code>
                                        </a>
                                     ) : (
                                         <code className="text-gray-500">URL Endpoint tidak tersedia.</code>
                                     )}
                                </pre>
                                {/* Tombol Salin */}
                                {dataset.data_url && ( // Hanya tampilkan jika ada URL
                                    <button
                                        onClick={handleCopyUrl}
                                        title="Salin URL"
                                        className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                            copyStatus === 'Disalin!'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                        }`}
                                    >
                                         {copyStatus === 'Salin' ? (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                             </svg>
                                         ) : copyStatus === 'Disalin!' ? (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                             </svg>
                                         ) : ( // Gagal atau Error
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                         )}
                                        <span className="ml-1.5">{copyStatus}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                     {/* --- BATAS MODIFIKASI --- */}
                </div>
            </div>
        </>
    );
}