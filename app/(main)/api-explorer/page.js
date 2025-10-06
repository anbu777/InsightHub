// File: app/(main)/api-explorer/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

// Fungsi helper untuk download
function download(content, fileName, mimeType) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fungsi untuk mengubah JSON (array of objects) ke CSV
function convertJsonToCsv(jsonData) {
    if (!jsonData || jsonData.length === 0) return "Tidak ada data untuk dikonversi.";
    const headers = Object.keys(jsonData[0]);
    let csv = headers.join(',') + '\n';
    jsonData.forEach(row => {
        csv += headers.map(header => `"${(row[header] === null || row[header] === undefined) ? '' : row[header].toString().replace(/"/g, '""')}"`).join(',') + '\n';
    });
    return csv;
}

export default function ApiExplorerPage() {
    // Logika otorisasi telah dihapus dari sini
    
    // State
    const [totalApi, setTotalApi] = useState(0);
    const [apiList, setApiList] = useState([]); 
    const [lastResult, setLastResult] = useState({ json: '', csv: '' });
    const [outputText, setOutputText] = useState('Hasil akan ditampilkan di sini...');
    const [showDownload, setShowDownload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect untuk penjaga rute (pengecekan login) telah dihapus

    // Efek untuk mengambil daftar tabel riil dari API katalog untuk dropdown
    useEffect(() => {
        fetch('/api/catalog/tables')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    data.sort((a, b) => a.tablename.localeCompare(b.tablename));
                    setTotalApi(data.length);
                    setApiList(data);
                }
            })
            .catch(error => console.error("Gagal memuat daftar tabel:", error));
    }, []); // Dependency array dikosongkan agar berjalan sekali

    // Handler untuk form pencarian
    const handleApiFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setOutputText('Memuat data dari DBeaver...');
        setShowDownload(false);

        const selectedTableName = event.target.serviceSelect.value;
        const requestType = event.target.requestType.value;
        const outputFormat = event.target.outputFormat.value;

        if (!selectedTableName) {
            setOutputText('Silakan pilih service (nama tabel) terlebih dahulu.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/explorer/${selectedTableName}?requestType=${requestType}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Gagal mengambil data.');
            }
            const jsonData = await response.json();

            if (jsonData.length === 0) {
                 setOutputText(`Tidak ada data yang ditemukan untuk tabel "${selectedTableName}".`);
                 setShowDownload(false);
                 setIsLoading(false);
                 return;
            }

            const jsonString = JSON.stringify(jsonData, null, 2);
            const csvString = convertJsonToCsv(jsonData);

            setLastResult({ json: jsonString, csv: csvString });
            setOutputText(outputFormat === 'json' ? jsonString : csvString);
            setShowDownload(true);

        } catch (error) {
            setOutputText(`Error: ${error.message}`);
            setShowDownload(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Kondisi loading otorisasi telah dihapus

    return (
        <div className="container mx-auto px-6 pt-8 pb-32">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border flex items-center">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4m-8 16v-4" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalApi > 0 ? totalApi : '...'}</p>
                        <p className="text-sm text-gray-500">Total API Tersedia</p>
                    </div>
                </div>
               
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Parameter Pencarian</h2>
                    <form id="api-form" onSubmit={handleApiFormSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-1">Service (Nama Tabel)</label>
                            <select id="service-select" name="serviceSelect" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900">
                                <option value="">Pilih Service...</option>
                                {apiList.map(api => (
                                    <option key={api.tablename} value={api.tablename}>{api.tablename}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="request-type" className="block text-sm font-medium text-gray-700 mb-1">Jenis Request</label>
                            <select id="request-type" name="requestType" defaultValue="data" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900">
                                <option value="data">Data (Konten Tabel)</option>
                                <option value="metadata">Metadata (Struktur Tabel)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="output-format" className="block text-sm font-medium text-gray-700 mb-1">Format Output</label>
                            <select id="output-format" name="outputFormat" defaultValue="json" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-900">
                                <option value="json,csv">JSON / CSV</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Memproses...' : 'Cari Data'}
                        </button>
                    </form>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Hasil</h2>
                        <div className={`${showDownload ? '' : 'hidden'} space-x-2`}>
                            <button type="button" onClick={() => download(lastResult.json, `${document.getElementById('service-select').value}.json`, 'application/json')} className="text-xs bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full hover:bg-gray-300">Download .json</button>
                            <button type="button" onClick={() => download(lastResult.csv, `${document.getElementById('service-select').value}.csv`, 'text/csv')} className="text-xs bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full hover:bg-gray-300">Download .csv</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 text-white rounded-lg h-full p-1 flex-grow min-h-[200px]">
                        <pre className="h-full w-full overflow-auto text-sm p-4 whitespace-pre-wrap break-words">{outputText}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}