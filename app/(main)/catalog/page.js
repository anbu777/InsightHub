// app/(main)/catalog/page.js

"use client"; // DIUBAH: Halaman ini menjadi Client Component untuk menangani form interaktif

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// ========================
// 🔹 Komponen Dataset Card (DIUBAH)
// ========================
function DatasetCard({ dataset }) {
    return (
        <div className="border rounded-lg p-6 flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
            <div>
                <div className="flex justify-center mb-4 h-16 items-center">
                    <Image
                        src="/logo-api.png"
                        alt="Logo API"
                        width={129}
                        height={64}
                        className="object-contain"
                        priority
                    />
                </div>

                <h3 className="text-lg font-bold text-gray-800 text-center flex items-center justify-center" style={{ minHeight: '56px' }}>
                    {dataset.title || 'Tanpa Judul'}
                </h3>

                {/* DIUBAH: Layout Kategori & UNOR menjadi berdampingan */}
                <div className="mt-4 flex justify-between items-center text-xs">
                    <span className="font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-blue-600 bg-blue-100">
                        {dataset.categories?.nama_kategori || 'UMUM'}
                    </span>
                    <span className="font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-100 truncate max-w-[150px]">
                        {dataset.unors?.nama_unor || 'TIDAK DIKETAHUI'}
                    </span>
                </div>
            </div>

            <Link
                href={`/detail/${dataset.id}`}
                className="text-center w-full mt-6 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
                LIHAT DETAIL
            </Link>
        </div>
    );
}

// ========================
// 🔹 Komponen Paginasi (DIUBAH)
// ========================
function Pagination({ currentPage, totalPages, search, unor, category }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const buildQueryString = (page) => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', page);
        if (search) params.set('search', search);
        if (unor) params.set('unor', unor);
        if (category) params.set('category', category);
        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    };

    return (
        <nav className="flex justify-center mt-8">
            {pages.map(page => (
                <Link
                    key={page}
                    href={`/catalog${buildQueryString(page)}`}
                    className={`pagination-btn mx-1 px-3 py-1 border rounded-md text-sm ${
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                >
                    {page}
                </Link>
            ))}
        </nav>
    );
}

// ========================
// 🔹 Komponen FilterBar (DIUBAH TOTAL)
// ========================
function FilterBar({ allUnors, allCategories, initialValues }) {
    const router = useRouter();
    const pathname = usePathname();

    // Fungsi untuk handle perubahan pada form dan update URL
    const handleFilterChange = (e) => {
        const form = e.currentTarget;
        const formData = new FormData(form);
        const params = new URLSearchParams();

        // Ambil nilai dari setiap input
        const search = formData.get('search');
        const unor = formData.get('unor');
        const category = formData.get('category');

        // Tambahkan ke URL params jika ada nilainya
        if (search) params.set('search', search);
        if (unor) params.set('unor', unor);
        if (category) params.set('category', category);

        // Gunakan router.replace untuk update URL tanpa menambah history browser
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="sticky top-24 z-30 bg-slate-100 border-b border-slate-200 p-4 mb-8 rounded-lg">
            <form onChange={handleFilterChange} className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-grow w-full md:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        name="search"
                        placeholder="Cari dataset..."
                        defaultValue={initialValues.search}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>

                {/* Filter UNOR */}
                <select 
                    name="unor"
                    defaultValue={initialValues.unor}
                    className="w-full md:w-56 px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                    <option value="">Semua Unit Organisasi</option>
                    {allUnors.map(unor => (
                        <option key={unor.id} value={unor.id}>{unor.nama_unor}</option>
                    ))}
                </select>

                {/* Filter Kategori */}
                <select 
                    name="category"
                    defaultValue={initialValues.category}
                    className="w-full md:w-56 px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                    <option value="">Semua Kategori</option>
                    {allCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
                    ))}
                </select>
            </form>
        </div>
    );
}

// ========================
// 🔹 Halaman Utama Katalog (DIUBAH MENJADI CLIENT COMPONENT)
// ========================
export default function CatalogPage() {
    // State untuk menyimpan data yang di-fetch
    const [datasets, setDatasets] = useState([]);
    const [count, setCount] = useState(0);
    const [allUnors, setAllUnors] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const searchParams = useSearchParams();
    const rowsPerPage = 12;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            // Ambil parameter dari URL
            const search = searchParams.get('search') || '';
            const unor = searchParams.get('unor') || '';
            const category = searchParams.get('category') || '';
            const page = parseInt(searchParams.get('page') || '1', 10);
            const offset = (page - 1) * rowsPerPage;

            try {
                // Fetch unors dan categories hanya sekali jika belum ada
                if (allUnors.length === 0 || allCategories.length === 0) {
                    const [unorsResult, categoriesResult] = await Promise.all([
                        supabase.from('unors').select('*').order('nama_unor'),
                        supabase.from('categories').select('*').order('nama_kategori')
                    ]);
                    if (unorsResult.error) throw unorsResult.error;
                    if (categoriesResult.error) throw categoriesResult.error;
                    setAllUnors(unorsResult.data || []);
                    setAllCategories(categoriesResult.data || []);
                }

                // Bangun query dataset dinamis
                let query = supabase
                    .from('datasets')
                    .select('*, categories(nama_kategori), unors(nama_unor)', { count: 'exact' });

                if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
                if (unor) query = query.eq('unor_id', unor);
                if (category) query = query.eq('category_id', category);

                const { data, error, count } = await query
                    .order('title', { ascending: true })
                    .range(offset, offset + rowsPerPage - 1);

                if (error) throw error;
                
                setDatasets(data || []);
                setCount(count || 0);

            } catch (err) {
                console.error('Error fetching catalog data:', JSON.stringify(err, null, 2));
                setErrorMessage(err?.message || 'Terjadi kesalahan saat mengambil data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchParams]); // Re-fetch data setiap kali searchParams berubah

    const search = searchParams.get('search') || '';
    const unor = searchParams.get('unor') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const totalPages = Math.ceil(count / rowsPerPage);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Katalog Data</h1>

            <FilterBar 
                allUnors={allUnors}
                allCategories={allCategories}
                initialValues={{ search, unor, category }}
            />

            {isLoading && !errorMessage && <p className="text-center text-gray-500 col-span-full">Memuat data...</p>}
            
            {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Terjadi Kesalahan</p>
                    <p>{errorMessage}</p>
                </div>
            )}

            {!isLoading && !errorMessage && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {datasets.length > 0 ? (
                            datasets.map(dataset => (
                                <DatasetCard key={dataset.id} dataset={dataset} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full py-16">
                                {search || unor || category
                                    ? `Tidak ada data yang cocok untuk kriteria Anda.`
                                    : 'Belum ada data di dalam katalog.'}
                            </p>
                        )}
                    </div>

                    <Pagination currentPage={page} totalPages={totalPages} search={search} unor={unor} category={category} />
                </>
            )}
        </div>
    );
}