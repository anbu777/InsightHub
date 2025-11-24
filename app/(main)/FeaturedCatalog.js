// app/(main)/FeaturedCatalog.js

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion'; // Impor motion

// Varian animasi untuk kartu (fade-in & slide-up)
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Varian animasi untuk container grid (stagger)
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Komponen Card individual (dibungkus motion.div)
const ApiCard = ({ api }) => (
    <motion.div 
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200/80 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
    >
        <h4 className="font-bold text-gray-800 line-clamp-2">{api.title || 'Nama API tidak tersedia'}</h4>
        <p className="text-sm text-gray-600 mt-2 flex-grow min-h-[40px] line-clamp-3">
            {api.description || 'Deskripsi tidak tersedia.'}
        </p>
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 truncate max-w-[60%]">{api.unors?.nama_unor || 'Umum'}</span>
            <Link href={`/detail/${api.id}`} className="text-xs bg-[#FFD100] text-[#0D2A57] font-bold py-1.5 px-3 rounded-md hover:bg-yellow-400 transition-colors">
                Lihat Detail
            </Link>
        </div>
    </motion.div>
);

// Komponen utama
// Terima prop 'inView' dari parent untuk memicu animasi
export default function FeaturedCatalog({ popularApis, latestApis, inView }) {
    return (
        <section className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="container mx-auto">
                <Link href="/catalog" className="absolute top-8 right-8 text-sm font-semibold text-[#0D2A57] hover:underline">
                    Lihat Semua &rarr;
                </Link>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Katalog Unggulan
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Temukan dataset yang paling sering dilihat dan yang baru ditambahkan.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Kolom Dataset Populer */}
                    <div>
                        <div className="bg-[#0D2A57] text-yellow-300 p-3 rounded-t-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <h3 className="font-bold">Dataset Populer</h3>
                        </div>
                        <motion.div 
                            className="bg-white p-4 rounded-b-lg border-x border-b border-gray-200 flex flex-col gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            {popularApis?.map((api) => (
                                <ApiCard key={`pop-${api.id}`} api={api} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Kolom Dataset Terbaru */}
                    <div>
                        <div className="bg-[#0D2A57] text-yellow-300 p-3 rounded-t-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            <h3 className="font-bold">Dataset Terbaru</h3>
                        </div>
                        <motion.div 
                            className="bg-white p-4 rounded-b-lg border-x border-b border-gray-200 flex flex-col gap-4"
                            variants={containerVariants} // Gunakan varian yang sama
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            {latestApis?.map((api) => (
                                <ApiCard key={`new-${api.id}`} api={api} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}