// File: app/(main)/catalog/page.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { descriptions } from '@/lib/table_descriptions';

export default function CatalogPage() {
    const router = useRouter(); 
    const [isAuthorized, setIsAuthorized] = useState(false); 

    // --- STATE MANAGEMENT ---
    const [allApiData, setAllApiData] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isSigiChecked, setIsSigiChecked] = useState(true);
    
    const rowsPerPage = 9;

    // --- EFEK 1: PENJAGA RUTE (TIDAK BERUBAH) ---
    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (!user) {
            router.push('/login-register');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // --- EFEK 2: Mengambil Data (TIDAK BERUBAH) ---
    useEffect(() => {
        if (isAuthorized) {
            setIsLoading(true);
            fetch('/api/catalog/tables')
                .then(response => response.json())
                .then(apiData => {
                    const transformedData = apiData.map(item => ({
                        table_name: item.tablename,
                        kategori: item.schemaname,
                        deskripsi: descriptions[item.tablename] || 'Deskripsi untuk tabel ini belum tersedia.',
                    }));
                    setAllApiData(transformedData);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Gagal mengambil data dari API:", error);
                    setIsLoading(false);
                });
        }
    }, [isAuthorized]); 

    // --- EFEK 3: Memproses Ulang Data (TIDAK BERUBAH) ---
    useEffect(() => {
        if (!isAuthorized) return; 

        let filteredData = isSigiChecked ? allApiData : [];

        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.table_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        const newPageCount = Math.ceil(filteredData.length / rowsPerPage);
        setPageCount(newPageCount);

        if (currentPage > newPageCount && newPageCount > 0) {
            setCurrentPage(1);
        }
        
        const paginated = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
        setPaginatedData(paginated);
    }, [allApiData, currentPage, searchTerm, isAuthorized, isSigiChecked]);

    // --- HANDLER (TIDAK BERUBAH) ---
    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSigiFilterChange = () => {
        setIsSigiChecked(prev => !prev);
        setCurrentPage(1);
    };

    const PaginationButtons = () => {
        if (pageCount <= 1) return null;
        let buttons = [];
        for (let i = 1; i <= pageCount; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`pagination-btn mx-1 px-3 py-1 border rounded-md text-sm ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const formatTitle = (tablename) => {
      return tablename
        .replace(/^(sigi_)/, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // --- RENDER CHECK (TIDAK BERUBAH) ---
    if (!isAuthorized) {
        return <div className="flex items-center justify-center h-96"><p>Memeriksa otorisasi...</p></div>;
    }

    // --- RENDER TAMPILAN (JSX) ---
    return (
        <div className="container mx-auto px-6 py-12"> 
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4">
                    <div className="bg-white p-6 rounded-xl shadow-md sticky top-28 border">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Filter</h3>
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-700">Sumber Data</h4>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={isSigiChecked}
                                            onChange={handleSigiFilterChange}
                                            className="filter-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-600">Sigi</span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                                        {allApiData.length}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="w-full lg:w-3/4">
                    <input 
                        type="search" 
                        placeholder="Cari aplikasi atau data..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        // PERUBAHAN DI SINI
                        className="w-full pl-4 pr-4 py-3 mb-8 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    
                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading data...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedData.length > 0 ? (
                                paginatedData.map(item => (
                                    <div key={item.table_name} className="relative bg-white border rounded-lg shadow-md p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
                                        <span className={`absolute top-3 right-3 text-xs font-bold ${item.kategori === 'v2_datalake' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full`}>
                                            {item.kategori}
                                        </span>
                                        <div className="flex justify-center py-4">
                                            <Image
                                                src="/logo-api.png"
                                                alt="API Logo"
                                                width={120}
                                                height={120}
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="text-md font-bold text-gray-800 text-center">{formatTitle(item.table_name)}</h3>
                                        <p className="text-sm text-gray-600 text-center mt-1 mb-4 flex-grow h-20 overflow-hidden">{item.deskripsi}</p>
                                        <Link href={`/detail?table=${item.table_name}`} className="text-center w-full mt-auto bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            LIHAT DETAIL
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 col-span-full">Tidak ada data yang cocok dengan filter atau pencarian Anda.</p>
                            )}
                        </div>
                    )}
                    
                    <nav className="flex justify-center mt-8">
                        <PaginationButtons />
                    </nav>
                </section>
            </div>
        </div>
    );
}