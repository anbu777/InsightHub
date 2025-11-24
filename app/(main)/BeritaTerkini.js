// app/(main)/BeritaTerkini.js
"use client";

import Link from 'next/link';
import NewsCard from './components/NewsCard';
import { motion } from 'framer-motion';

// Varian animasi untuk container (mengatur stagger)
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1 // Jeda 0.1 detik antar kartu
        }
    }
};

export default function BeritaTerkini({ newsItems, inView }) {
    if (!newsItems || newsItems.length === 0) {
        return null;
    }

    return (
        // Tambahkan 'relative' agar positioning absolute bekerja terhadap container ini
        <div className="container mx-auto relative">
            
            {/* 1. Tautan "Lihat Semua" (Desktop Only - Posisi Absolut di Kanan Atas) */}
            <div className="hidden md:block absolute top-1 right-0 z-10">
                <Link 
                    href="/berita" 
                    className="text-sm font-semibold text-[#0D2A57] hover:text-blue-700 group flex items-center"
                >
                    Lihat Semua
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>

            {/* 2. Header Judul & Subjudul (Rata Tengah) */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Berita Terkini Pusdatin</h2>
                <p className="text-gray-600 mt-2">Temukan berita terbaru seputar data dan teknologi di lingkungan Kementerian PU.</p>
            </div>

            {/* 3. Kontainer Grid dengan Animasi Stagger */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"} // Dipicu oleh prop inView dari parent
            >
                {newsItems.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </motion.div>

            {/* 4. Tombol Lihat Semua (Mobile Only - Muncul di bawah grid di layar kecil) */}
            <div className="mt-8 text-center md:hidden">
                 <Link 
                    href="/berita" 
                    className="inline-block px-6 py-2 border border-[#0D2A57] text-[#0D2A57] font-semibold rounded-full hover:bg-[#0D2A57] hover:text-white transition-colors"
                >
                    Lihat Semua Berita
                </Link>
            </div>
        </div>
    );
}