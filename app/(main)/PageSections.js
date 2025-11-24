// app/(main)/PageSections.js

"use client";

import { useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { NavigationContext } from './contexts/NavigationContext';
import FeaturedCatalog from './FeaturedCatalog';
import Link from 'next/link';
import { unorIconMap } from '@/lib/unorIcons';
import BeritaTerkini from './BeritaTerkini';
import { motion } from 'framer-motion'; // Impor motion

const externalUnorLinks = {
  "Direktorat Jenderal Bina Konstruksi": "https://binakonstruksi.pu.go.id/",
  "Direktorat Jenderal Pembiayaan Infrastruktur": "https://pembiayaan.pu.go.id/",
  "Inspektorat Jenderal": "https://itjen.pu.go.id/",
  "Badan Pengembangan Infrastruktur Wilayah": "https://bpiw.pu.go.id/",
  "Badan Pengembangan Wilayah Sumber Daya Manusia": "https://bpsdm.pu.go.id/"
};

// Varian animasi untuk Section (Fade In Up)
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

export default function PageSections({ featuredData, latestData, sortedUnors, beritaData }) {
    const { setActiveSection } = useContext(NavigationContext) || {};

    // Setup Intersection Observers
    const { ref: howItWorksRef, inView: howItWorksInView } = useInView({ threshold: 0.2, triggerOnce: true });
    const { ref: featuredRef, inView: featuredInView } = useInView({ threshold: 0.2, triggerOnce: true });
    const { ref: newsRef, inView: newsInView } = useInView({ threshold: 0.2, triggerOnce: true });
    const { ref: unorRef, inView: unorInView } = useInView({ threshold: 0.2, triggerOnce: true });

    // Update Active Section di Navbar
    const { ref: navHowItWorksRef, inView: navHowItWorksInView } = useInView({ threshold: 0.5 });
    const { ref: navFeaturedRef, inView: navFeaturedInView } = useInView({ threshold: 0.5 });
    const { ref: navNewsRef, inView: navNewsInView } = useInView({ threshold: 0.5 });
    const { ref: navUnorRef, inView: navUnorInView } = useInView({ threshold: 0.5 });

    useEffect(() => { if (navHowItWorksInView) setActiveSection('how-it-works'); }, [navHowItWorksInView, setActiveSection]);
    useEffect(() => { if (navFeaturedInView) setActiveSection('featured-catalog'); }, [navFeaturedInView, setActiveSection]);
    useEffect(() => { if (navNewsInView) setActiveSection('news-section'); }, [navNewsInView, setActiveSection]);
    useEffect(() => { if (navUnorInView) setActiveSection('unor-section'); }, [navUnorInView, setActiveSection]);

    // Helper untuk menggabungkan refs
    const setHowItWorksRef = (node) => { howItWorksRef(node); navHowItWorksRef(node); };
    const setFeaturedRef = (node) => { featuredRef(node); navFeaturedRef(node); };
    const setNewsRef = (node) => { newsRef(node); navNewsRef(node); };
    const setUnorRef = (node) => { unorRef(node); navUnorRef(node); };


    // === PERBAIKAN DI SINI: Hapus 'max-w-7xl mx-auto' agar lebar penuh ===
    return (
        <div className="p-6 flex flex-col gap-16 w-full"> 
            
            {/* SECTION 1: CARA KERJA */}
            <motion.section 
                ref={setHowItWorksRef} 
                id="how-it-works" 
                className="scroll-mt-28 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
                variants={sectionVariants}
                initial="hidden"
                animate={howItWorksInView ? "visible" : "hidden"}
            >
                 <div className="container mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bagaimana Memulai?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-12">Ikuti tiga langkah mudah ini untuk menemukan dan memanfaatkan data yang Anda butuhkan.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                             {/* Card 1 */}
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">1. Temukan Data</h3>
                                <p className="text-gray-600 text-center text-sm">Gunakan fitur pencarian atau jelajahi katalog untuk menemukan informasi yang relevan.</p>
                            </div>
                            {/* Card 2 */}
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">2. Pelajari Metadata</h3>
                                <p className="text-gray-600 text-center text-sm">Lihat detail setiap dataset, termasuk metadata, struktur, dan contoh data untuk memastikan kesesuaian.</p>
                            </div>
                            {/* Card 3 */}
                            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full">
                                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#0D2A57] text-yellow-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">3. Integrasikan API</h3>
                                <p className="text-gray-600 text-center text-sm">Gunakan URL API yang tersedia untuk mengintegrasikan data langsung ke dalam aplikasi Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SECTION 2: KATALOG UNGGULAN */}
            <motion.div 
                ref={setFeaturedRef} 
                id="featured-catalog" 
                className="scroll-mt-28"
                variants={sectionVariants}
                initial="hidden"
                animate={featuredInView ? "visible" : "hidden"}
            >
                <FeaturedCatalog popularApis={featuredData} latestApis={latestData} inView={featuredInView} />
            </motion.div>

            {/* SECTION 3: BERITA TERKINI */}
            <motion.section 
                ref={setNewsRef} 
                id="news-section" 
                className="scroll-mt-28 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
                variants={sectionVariants}
                initial="hidden"
                animate={newsInView ? "visible" : "hidden"}
            >
                <BeritaTerkini newsItems={beritaData} inView={newsInView} />
            </motion.section>

            {/* SECTION 4: UNIT ORGANISASI */}
            <motion.section 
                ref={setUnorRef} 
                id="unor-section" 
                className="relative scroll-mt-28 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
                variants={sectionVariants}
                initial="hidden"
                animate={unorInView ? "visible" : "hidden"}
            >
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

                            const CardContent = (
                                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                                    <div className="h-16 w-16 mb-4 text-[#0D2A57]">{IconComponent}</div>
                                    <h3 className="text-md font-bold text-gray-800 mt-2 flex-grow">{unor.nama_unor}</h3>
                                    <span className="mt-4 w-full bg-[#FFD100] text-[#0D2A57] font-bold py-2 rounded-lg text-sm transition-colors hover:bg-yellow-400">Jelajahi</span>
                                </div>
                            );

                            return externalUrl ? (
                                <a key={unor.id} href={externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
                                    {CardContent}
                                </a>
                            ) : (
                                <Link key={unor.id} href={`/catalog?unor=${unor.id}`} className="block h-full">
                                    {CardContent}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}