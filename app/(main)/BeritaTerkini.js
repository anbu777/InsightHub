// app/(main)/BeritaTerkini.js

"use client";

import { useRef } from 'react';
import Link from 'next/link';
import NewsCard from './components/NewsCard';

function ArrowIcon({ className = "" }) { // Tambah className prop
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 ${className}`}> {/* Terapkan className */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    );
}

export default function BeritaTerkini({ newsItems }) {
    const scrollContainerRef = useRef(null);

    if (!newsItems || newsItems.length === 0) {
        return null;
    }

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const firstCardWrapper = scrollContainerRef.current.querySelector('.p-3');
            if (!firstCardWrapper) return;
            const cardWidth = firstCardWrapper.getBoundingClientRect().width;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        // --- MODIFIKASI: Hapus 'container mx-auto', tambahkan 'relative' ---
        <div className="relative">
            {/* Tautan Lihat Semua (Posisi absolut di kanan atas SECTION) */}
            <Link href="/berita" className="absolute top-0 right-0 text-sm font-semibold text-[#0D2A57] hover:underline">
                    Lihat Semua &rarr;
                    
                </Link>
            {/* Judul & Subtitle Rata Tengah */}
            <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Berita Terkini Pusdatin</h2>
                        <p className="text-gray-600 mt-2">Temukan berita terbaru dari pusdatin.</p>
                    </div>

            {/* Tombol Panah (Posisi absolut di kanan bawah SECTION) */}
            {/* Pindahkan ini ke bawah slider untuk positioning yg benar */}
            {/* Container Slider */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-snap-type-x mandatory scrollbar-hide -m-3 mb-4" // Tambah mb-4 untuk jarak ke panah
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {newsItems.map((item) => (
                    <NewsCard key={item.id} item={item} layoutType="slider" />
                ))}
            </div>

             {/* --- MODIFIKASI: Tombol Panah di kanan bawah --- */}
             {/* Posisikan absolut relatif terhadap div terluar */}
            <div className="absolute bottom-[-1rem] right-0 flex space-x-2 z-10 md:bottom-[-1.5rem]"> {/* Sesuaikan bottom & right */}
                <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                     {/* Gunakan ArrowIcon dengan class rotate */}
                    <ArrowIcon className="rotate-180" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowIcon />
                </button>
            </div>
            {/* --- BATAS MODIFIKASI PANAH --- */}
        </div>
    );
}