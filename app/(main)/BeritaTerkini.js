// app/(main)/BeritaTerkini.js

"use client";

import { useRef } from 'react';
import Link from 'next/link';
import NewsCard from './components/NewsCard'; // Impor NewsCard

// Komponen Ikon Panah (SVG)
function ArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    );
}

// Komponen Slider Utama
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
        <div className="container mx-auto">
             {/* --- MODIFIKASI: Header Section Layout --- */}
             {/* Wrapper relatif untuk positioning absolut 'Lihat Semua' */}
            <div className="relative mb-4"> {/* Beri sedikit margin bawah */}
                {/* Judul & Subtitle Rata Tengah */}
                <div className="text-center mb-2"> {/* text-center untuk judul & subjudul */}
                    <h2 className="text-3xl font-bold text-gray-800">Berita Terkini Pusdatin</h2>
                    <p className="text-gray-600 mt-1 text-sm">Temukan berita terbaru dari pusdatin.</p>
                </div>

                {/* Tautan Lihat Semua (Posisi absolut di kanan atas) */}
                <Link
                    href="/berita"
                    // Posisi absolut relatif terhadap div terluar section header
                    className="absolute top-8 right-8 text-sm font-semibold text-[#0D2A57] hover:underline"
                >
                    Lihat Semua
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </Link>
            </div>

            {/* Tombol Panah (ditempatkan terpisah di bawah, rata kanan) */}
            <div className="flex justify-end space-x-2 mb-4"> {/* Margin bawah untuk jarak ke slider */}
                <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="rotate-180"><ArrowIcon /></span>
                </button>
                <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowIcon />
                </button>
            </div>
            {/* --- BATAS MODIFIKASI HEADER --- */}


            {/* Kontainer Slider */}
            <div
                ref={scrollContainerRef}
                 // Hapus mt-4 agar lebih dekat dengan panah
                className="flex overflow-x-auto scroll-snap-type-x mandatory scrollbar-hide -m-3" 
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {newsItems.map((item) => (
                    <NewsCard key={item.id} item={item} layoutType="slider" />
                ))}
            </div>
        </div>
    );
}