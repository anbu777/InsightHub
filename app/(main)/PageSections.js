// app/(main)/PageSections.js

"use client";

import { useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { NavigationContext } from './contexts/NavigationContext';
import FeaturedCatalog from './FeaturedCatalog'; // Komponen yang sudah kita buat
import Link from 'next/link';
import { unorIconMap } from '@/lib/unorIcons'; // Impor map ikon

// --- TAMBAHAN: Impor komponen BeritaTerkini ---
import BeritaTerkini from './BeritaTerkini'; 

// --- Peta Link Eksternal untuk UNOR (Tetap Sama) ---
const externalUnorLinks = {
  "Direktorat Jenderal Bina Konstruksi": "https://binakonstruksi.pu.go.id/",
  "Direktorat Jenderal Pembiayaan Infrastruktur": "https://pembiayaan.pu.go.id/",
  "Inspektorat Jenderal": "https://itjen.pu.go.id/",
  "Badan Pengembangan Infrastruktur Wilayah": "https://bpiw.pu.go.id/",
  "Badan Pengembangan Wilayah Sumber Daya Manusia": "https://bpsdm.pu.go.id/"
};

// --- MODIFIKASI: Tambahkan 'beritaData' ke props ---
export default function PageSections({ featuredData, latestData, sortedUnors, beritaData }) {
    const { setActiveSection } = useContext(NavigationContext) || {};

    // Buat refs dan logic 'inView' di sini
    const { ref: howItWorksRef, inView: howItWorksInView } = useInView({ threshold: 0.4 });
    const { ref: featuredRef, inView: featuredInView } = useInView({ threshold: 0.4 });
    // --- TAMBAHAN: Ref untuk section berita ---
    const { ref: newsRef, inView: newsInView } = useInView({ threshold: 0.4 });
    const { ref: unorRef, inView: unorInView } = useInView({ threshold: 0.4 });


    useEffect(() => { if (howItWorksInView) setActiveSection('how-it-works'); }, [howItWorksInView, setActiveSection]);
    useEffect(() => { if (featuredInView) setActiveSection('featured-catalog'); }, [featuredInView, setActiveSection]);
    // --- TAMBAHAN: UseEffect untuk section berita ---
    useEffect(() => { if (newsInView) setActiveSection('news-section'); }, [newsInView, setActiveSection]);
    useEffect(() => { if (unorInView) setActiveSection('unor-section'); }, [unorInView, setActiveSection]);

    return (
        <div className="p-6 flex flex-col gap-8">
            {/* SECTION: BAGAIMANA MEMULAI (Tetap Sama) */}
            <section ref={howItWorksRef} id="how-it-works" className="scroll-mt-28 bg-white rounded-xl shadow-lg p-8 md:p-12">
                <div className="container mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bagaimana Memulai?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-12">Ikuti tiga langkah mudah ini untuk menemukan dan memanfaatkan data yang Anda butuhkan.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">1. Temukan Data</h3>
                                <p className="text-gray-600 text-center text-sm">Gunakan fitur pencarian atau jelajahi katalog untuk menemukan informasi yang relevan.</p>
                            </div>
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">2. Pelajari Metadata</h3>
                                <p className="text-gray-600 text-center text-sm">Lihat detail setiap dataset, termasuk metadata, struktur, dan contoh data untuk memastikan kesesuaian.</p>
                            </div>
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">3. Integrasikan API</h3>
                                <p className="text-gray-600 text-center text-sm">Gunakan URL API yang tersedia untuk mengintegrasikan data langsung ke dalam aplikasi Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* SECTION: KATALOG UNGGULAN (Tetap Sama) */}
            <div ref={featuredRef} id="featured-catalog" className="scroll-mt-28">
                <FeaturedCatalog popularApis={featuredData} latestApis={latestData} />
            </div>

            {/* --- SECTION BARU: BERITA TERKINI --- */}
            <section ref={newsRef} id="news-section" className="scroll-mt-28 bg-gray-50 rounded-xl shadow-lg p-8 md:p-12">
                <BeritaTerkini newsItems={beritaData} />
            </section>
            {/* --- BATAS SECTION BARU --- */}


            {/* SECTION: UNIT ORGANISASI (Tetap Sama) */}
            <section ref={unorRef} id="unor-section" className="relative scroll-mt-28 bg-white rounded-xl shadow-lg p-8 md:p-12">
                <div className="container mx-auto">
                    <Link href="/catalog" className="absolute top-8 right-8 text-sm font-semibold text-[#0D2A57] hover:underline">
                        Lihat Semua &rarr;
                    </Link>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Jelajahi Data Berdasarkan Unit Organisasi</h2>
                        <p className="text-gray-600 mt-2">Temukan data spesifik dari setiap Unit Organisasi di Kementerian PUPR.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        
                        {sortedUnors.map((unor) => {
                            const IconComponent = unorIconMap[unor.nama_unor] || <div className="h-16 w-16 bg-slate-200 rounded-full"></div>;
                            const externalUrl = externalUnorLinks[unor.nama_unor];

                            return (
                                externalUrl ? (
                                    <a
                                        key={unor.id}
                                        href={externalUrl}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="h-16 w-16 mb-4">{IconComponent}</div>
                                        <h3 className="text-md font-bold text-gray-800 mt-2 flex-grow">{unor.nama_unor}</h3>
                                        <span className="mt-4 w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 rounded-lg text-sm">Jelajahi</span>
                                    </a>
                                ) : (
                                    <Link
                                        key={unor.id}
                                        href={`/catalog?unor=${unor.id}`}
                                        className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="h-16 w-16 mb-4">{IconComponent}</div>
                                        <h3 className="text-md font-bold text-gray-800 mt-2 flex-grow">{unor.nama_unor}</h3>
                                        <span className="mt-4 w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 rounded-lg text-sm">Jelajahi</span>
                                    </Link>
                                )
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}