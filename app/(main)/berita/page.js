// app/(main)/berita/page.js

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import NewsCard from '../components/NewsCard'; // Impor NewsCard

// Fungsi untuk mengambil SEMUA berita
async function getAllNews() {
    const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching all news:", error);
        return [];
    }
    return data || [];
}

// Komponen Halaman Daftar Berita (Server Component)
export default async function AllNewsPage() {
    const allNewsItems = await getAllNews();

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Tombol Kembali */}
            <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-8 group">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                 </svg>
                 Kembali ke Beranda
            </Link>

            {/* Judul Halaman */}
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Semua Berita Pusdatin</h1>

            {/* Grid Daftar Berita */}
            {allNewsItems.length > 0 ? (
                 // Kelas grid tetap sama
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 -m-3">
                    {allNewsItems.map(item => (
                         // --- MODIFIKASI: Tambahkan prop layoutType="grid" ---
                        <NewsCard key={item.id} item={item} layoutType="grid" /> 
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 col-span-full py-16">
                    Belum ada berita yang dipublikasikan.
                </p>
            )}
        </div>
    );
}

// Fungsi untuk metadata halaman (Opsional)
export async function generateMetadata() {
  return {
    title: 'Semua Berita Pusdatin | Insight Hub',
    description: 'Kumpulan berita dan informasi terbaru dari Pusdatin Kementerian PU.',
  }
}