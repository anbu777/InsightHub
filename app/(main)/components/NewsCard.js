// app/(main)/components/NewsCard.js
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Pastikan framer-motion terinstall

// Varian animasi untuk kartu (fade-in & slide-up)
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function NewsCard({ item }) {
    
    // Hapus prop 'layoutType' karena kita fokus ke grid saja sekarang.
    // Class wrapper disederhanakan untuk grid.
    
    return (
        <motion.div 
            className="h-full" // Wrapper motion mengisi tinggi penuh
            variants={cardVariants}
            whileHover={{ y: -5 }} // Efek hover naik sedikit
        >
            <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                
                {/* Gambar Berita */}
                <div className="relative w-full h-48 flex-shrink-0">
                     <Link href={`/berita/${item.id}`} className="block w-full h-full">
                        <Image
                            src={item.image_url || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image'}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 hover:scale-110"
                        />
                     </Link>
                </div>

                {/* Konten Teks */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Tanggal (Opsional, jika ada created_at) */}
                    {item.created_at && (
                        <p className="text-xs text-gray-500 mb-2">
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}

                    <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight line-clamp-2 hover:text-[#0D2A57] transition-colors">
                        <Link href={`/berita/${item.id}`}>
                            {item.title}
                        </Link>
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                        {item.excerpt}
                    </p>

                    <Link
                        href={`/berita/${item.id}`}
                        className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 group"
                    >
                        Baca Selengkapnya
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}