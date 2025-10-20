// app/(main)/SearchForm.js

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            // Mengarahkan ke halaman katalog dengan query pencarian
            router.push(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="mt-8 w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-lg border border-white/30 rounded-full shadow-lg transition-all duration-300 focus-within:shadow-xl">
            <div className="relative">
                <input 
                    type="search" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Cari dataset, API, atau lainnya..." 
                    className="w-full h-16 bg-transparent text-white placeholder-white/70 text-lg pl-8 pr-20 rounded-full focus:outline-none" 
                />
                <button 
                    type="submit" 
                    className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/30 hover:bg-white/50 text-white rounded-full h-10 w-10 flex items-center justify-center transition-colors" 
                    aria-label="Cari"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
