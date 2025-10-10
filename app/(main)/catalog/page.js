"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { descriptions } from '@/lib/table_descriptions';

function CatalogContent() {
    const router = useRouter(); 
    const searchParams = useSearchParams(); 

    // [REVISI] State baru untuk mengontrol visibilitas popup filter
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null); // Ref untuk mendeteksi klik di luar popup

    const [allApiData, setAllApiData] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigiChecked, setIsSigiChecked] = useState(true);
    const [error, setError] = useState(null); 
    const rowsPerPage = 12; // [REVISI] Jumlah item per halaman disesuaikan untuk grid 4 kolom (kelipatan 4)

    // [REVISI] useEffect untuk menutup popup filter saat klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);
    
    useEffect(() => {
        setIsLoading(true);
        setError(null); 
        fetch('/api/catalog/tables')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server. Coba muat ulang halaman.');
                }
                return response.json();
            })
            .then(apiData => {
                if (!Array.isArray(apiData)) {
                    throw new Error('Format data dari server tidak valid.');
                }
                const transformedData = apiData.map(item => ({
                    table_name: item.tablename,
                    kategori: item.schemaname,
                    deskripsi: descriptions[item.tablename] || 'Deskripsi untuk tabel ini belum tersedia.',
                }));
                setAllApiData(transformedData);
            })
            .catch(error => {
                console.error("Error di halaman katalog:", error);
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); 

    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [searchParams]);

    useEffect(() => {
        let filteredData = isSigiChecked ? allApiData : [];

        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.table_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        const newPageCount = Math.ceil(filteredData.length / rowsPerPage);
        setPageCount(newPageCount);

        const newCurrentPage = (currentPage > newPageCount && newPageCount > 0) ? 1 : currentPage;
        if(currentPage !== newCurrentPage) setCurrentPage(newCurrentPage);
        
        const paginated = filteredData.slice((newCurrentPage - 1) * rowsPerPage, newCurrentPage * rowsPerPage);
        setPaginatedData(paginated);
    }, [allApiData, currentPage, searchTerm, isSigiChecked]);

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
    
    if (error) {
        return <div className="text-center p-10 text-red-500">Terjadi Error: {error}</div>
    }

    return (
        <div className="container mx-auto px-6 py-12"> 
            
            {/* [REVISI] Toolbar Pencarian dan Filter yang Sticky */}
            <div className="sticky top-24 z-30 bg-slate-200/80 backdrop-blur-sm py-4 mb-8 -mx-2 px-2 rounded-lg">
                <div className="relative flex items-center gap-4">
                    {/* [REVISI] Search Bar dengan style baru */}
                    <div className="relative flex-grow">
                         <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="search" 
                            placeholder="Cari dataset atau informasi..."
                            value={searchTerm}
                            onChange={handleSearchInput}
                            className="w-full pl-12 pr-4 py-3 bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>
                    
                    {/* [REVISI] Tombol untuk membuka popup filter */}
                    <div className="relative" ref={filterRef}>
                        <button 
                            onClick={() => setIsFilterOpen(prev => !prev)}
                            className="flex items-center gap-2 flex-shrink-0 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 shadow-sm"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                            <span>Filter</span>
                        </button>
                        
                        {/* [REVISI] Konten Popup Filter */}
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white p-6 rounded-xl shadow-lg border z-40">
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
                        )}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Loading data...</p>
            ) : (
                <>
                    {/* [REVISI] Grid diubah menjadi 4 kolom di layar XL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedData.length > 0 ? (
                            paginatedData.map(item => (
                                <div key={item.table_name} className="relative bg-white border rounded-lg shadow-md p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <span className={`absolute top-3 right-3 text-xs font-bold ${item.kategori === 'v2_datalake' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full`}>
                                        {item.kategori}
                                    </span>
                                    <div className="flex justify-center py-4">
                                        <Image src="/logo-api.png" alt="API Logo" width={120} height={120} className="object-contain" />
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
                    
                    <nav className="flex justify-center mt-8">
                        <PaginationButtons />
                    </nav>
                </>
            )}
        </div>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="text-center p-12">Memuat halaman katalog...</div>}>
            <CatalogContent />
        </Suspense>
    );
}