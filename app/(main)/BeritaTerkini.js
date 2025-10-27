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
            // Gunakan scrollWidth card (termasuk margin/padding) untuk perhitungan yg lebih akurat
            const cardWidth = firstCardWrapper.getBoundingClientRect().width; 
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto">
             {/* --- MODIFIKASI: Header Section Layout --- */}
             {/* Gunakan flex wrap agar responsif di layar kecil */}
            <div className="flex flex-wrap justify-between items-end mb-6 gap-x-4 gap-y-2"> 
                {/* Judul & Subtitle */}
                 {/* Beri margin bawah agar tidak terlalu mepet tombol di mobile */}
                <div className="text-center flex-grow mb-2 md:mb-0"> 
                    <h2 className="text-3xl font-bold text-gray-800">Berita Terkini Pusdatin</h2>
                    <p className="text-gray-600 mt-1 text-sm">Temukan berita terbaru dari pusdatin.</p>
                </div>

                {/* Wrapper untuk Lihat Semua & Panah */}
                 {/* Gunakan flex dan beri jarak (gap-4) */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end md:justify-start"> 
                    {/* Tautan Lihat Semua */}
                    <Link
                        href="/berita"
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center group whitespace-nowrap"
                    >
                        Lihat Semua
                        <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </Link>

                    {/* Tombol Panah */}
                     {/* Beri jarak antar tombol (space-x-2) */}
                    <div className="flex space-x-2 flex-shrink-0"> 
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
                </div>
            </div>
            {/* --- BATAS MODIFIKASI HEADER --- */}

            {/* Kontainer Slider */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-snap-type-x mandatory scrollbar-hide -m-3 mt-4" // -m-3 kompensasi p-3 card
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {newsItems.map((item) => (
                     // --- MODIFIKASI: Tambahkan prop layoutType="slider" ---
                    <NewsCard key={item.id} item={item} layoutType="slider" /> 
                ))}
            </div>
        </div>
    );
}