// app/(main)/components/NewsCard.js
"use client";

import Image from 'next/image';
import Link from 'next/link';

// --- MODIFIKASI: Tambahkan prop 'layoutType' ---
export default function NewsCard({ item, layoutType = 'grid' }) { // Default ke 'grid' jika tidak disediakan

    // --- MODIFIKASI: Tentukan class lebar berdasarkan layoutType ---
    const widthClasses = layoutType === 'slider' 
        ? 'w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)]' // Lebar spesifik untuk slider (memakai calc untuk padding p-3)
        : ''; // Kosongkan untuk grid, biarkan grid container yang mengatur

    return (
        // --- MODIFIKASI: Terapkan widthClasses ---
        <div className={`flex-shrink-0 p-3 scroll-snap-align-start 
                        transition-all duration-300 ease-in-out hover:scale-[1.03] 
                        ${widthClasses}`}> {/* Tambahkan class lebar dinamis */}

            <div className="flex flex-col h-full bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-gray-200 transition-shadow duration-300 ease-in-out">

                {/* Gambar Berita */}
                <div className="relative w-full h-48 group">
                    <Link href={`/berita/${item.id}`} className="block w-full h-full"> {/* Hapus bg-gray-100 */}
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            layout="fill"
                            // --- MODIFIKASI: Kembalikan ke objectFit="cover" ---
                            objectFit="cover" // Isi area gambar, mungkin terpotong
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Konten Teks */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 h-14 line-clamp-2">
                        <Link href={`/berita/${item.id}`} className="hover:text-blue-700 transition-colors">{item.title}</Link>
                    </h3>
                    {/* Beri sedikit lebih banyak ruang untuk excerpt */}
                    <p className="text-sm text-gray-600 mb-4 flex-grow h-[4.5rem] line-clamp-3">{item.excerpt}</p> 

                    <Link
                        href={`/berita/${item.id}`}
                        className="mt-auto text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center group"
                    >
                        Baca Selengkapnya
                        <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}