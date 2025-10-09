"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// --- Komponen Rate Us & Modal (Tidak Diubah) ---
function RateUsButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            // Menghapus background biru & padding agar hanya gambar yang tampil
            className="fixed bottom-5 right-5 z-50 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            aria-label="Rate Us"
        >
            {/* Menggunakan komponen Image dari Next.js */}
            <Image
                src="/rateus.png" // Mengambil gambar dari folder public
                alt="Rate Us"
                width={150} // Anda bisa sesuaikan ukurannya di sini
                height={150} // Anda bisa sesuaikan ukurannya di sini
                className="cursor-pointer"
            />
        </button>
    );
}
function SurveyModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    const [rating, setRating] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Terima kasih atas masukan Anda!');
        onClose();
    };
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Survey Kepuasan Open Data PU</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Terima kasih telah menggunakan Open Data PU. Kami menghargai masukan Anda untuk meningkatkan kualitas layanan dan sistem pengelolaan data kami.</p>
                <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nama <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                            <div className="flex space-x-6">
                                <label className="flex items-center"><input type="radio" name="gender" value="male" className="mr-2" required /> Laki-laki</label>
                                <label className="flex items-center"><input type="radio" name="gender" value="female" className="mr-2" /> Perempuan</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Rentang Usia <span className="text-red-500">*</span></label>
                            <select name="age" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <option value="">Pilih usia...</option>
                                <option value="<20">{'< 20 Tahun'}</option>
                                <option value="21-30">21 - 30 Tahun</option>
                                <option value="31-40">31 - 40 Tahun</option>
                                <option value=">40">{'> 40 Tahun'}</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <label className="block text-sm font-medium mb-2">Bagaimana pendapat Anda tentang Open Data PU? <span className="text-red-500">*</span></label>
                            <div className="flex justify-around items-center">
                                {['😡', '☹️', '😐', '🙂', '😄'].map((emoji, index) => (
                                    <button 
                                        key={index}
                                        type="button"
                                        onClick={() => setRating(index)}
                                        className={`text-4xl p-2 rounded-full transition-transform transform ${rating === index ? 'scale-125 bg-blue-100' : 'hover:scale-110'}`}
                                    >{emoji}</button>
                                ))}
                                <input type="hidden" name="satisfaction" value={rating} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Bagaimana teknis penyajian data Open Data PU? <span className="text-red-500">*</span></label>
                            <div className="flex justify-around items-center opacity-50 cursor-not-allowed">
                                {['😡', '☹️', '😐', '🙂', '😄'].map((emoji, index) => <span key={index} className="text-4xl p-2">{emoji}</span>)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="suggestion" className="block text-sm font-medium mb-1">Menurut Anda, fitur apa yang perlu ditingkatkan pada Open Data PU?</label>
                        <textarea id="suggestion" name="suggestion" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition-colors">Kirim</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Tentang Insight Hub</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-4 text-gray-600">
                    <p><strong>PUPR Insight Hub</strong> adalah sebuah platform terpusat yang dirancang untuk menjadi gerbang utama dalam mengakses dan memanfaatkan data di lingkungan Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).</p>
                    <p>Platform ini berfungsi sebagai katalog data terintegrasi yang memungkinkan pengguna, baik dari internal kementerian maupun publik, untuk dengan mudah menemukan, menjelajahi, dan mengajukan permintaan akses terhadap berbagai set data yang tersedia.</p>
                    <p>Dengan adanya Insight Hub, kami bertujuan untuk meningkatkan transparansi, mendorong inovasi berbasis data, dan memfasilitasi pertukaran informasi yang efisien untuk mendukung pengambilan keputusan yang lebih baik dalam pembangunan infrastruktur nasional.</p>
                </div>
                <div className="text-right mt-8">
                    <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
}


// Komponen Header
function SmartHeader({ onAboutClick }) {
    const pathname = usePathname(); 

    // --- PERUBAHAN UTAMA DI SINI ---
    const getLinkClassName = (path) => {
        const isActive = pathname === path || 
                         (path === '/catalog' && pathname.startsWith('/catalog')) ||
                         (path === '/api-explorer' && pathname.startsWith('/api-explorer'));
        
        // Gaya untuk link tidak aktif
        let classes = "px-4 py-2 rounded-full transition-colors duration-200 font-semibold text-white hover:bg-white/10";

        if (isActive) {
            // Gaya untuk link aktif: lingkaran kuning berisi dengan teks biru tua agar kontras
            classes = "px-4 py-2 rounded-full transition-colors duration-200 font-bold bg-yellow-400 text-blue-900";
        }
        
        return classes;
    };

    return (
        <header className="text-white shadow-lg sticky top-0 z-50 bg-gradient-to-b from-blue-900 to-blue-800">
            <div className="container mx-auto px-6">
                <nav className="relative flex justify-between items-center">
                    <div className="flex-1 flex justify-start">
                        <Link href="/">
                            <Image 
                                src="/LogoInsight.png" 
                                alt="Logo Insight-Hub" 
                                width={240}
                                height={80}
                                className="h-20 w-auto"
                                priority 
                            />
                        </Link>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-4 text-sm">
                        <Link href="/" className={getLinkClassName('/')}>Home</Link>
                        <Link href="/catalog" className={getLinkClassName('/catalog')}>Katalog</Link>
                        <Link href="/api-explorer" className={getLinkClassName('/api-explorer')}>Api Explorer</Link> 
                        <button onClick={onAboutClick} className={getLinkClassName('/tentang')}>Tentang</button> 
        
                    </div>
                    <div className="flex-1 flex justify-end">
                    </div>
                </nav>
            </div>
        </header>
    );
}

// Komponen Footer (Tidak Berubah)
function NewFooter() {
    return (
        <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white border-t border-blue-700">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Image src="/LogoPUPR.png" alt="Logo Kementerian PUPR" width={200} height={60} className="h-auto w-auto"/>
                        <div className="mt-4 text-sm text-blue-100">
                            <h3 className="text-lg font-bold text-white mb-2">Pusat Data dan Teknologi Informasi</h3>
                            <p className="leading-relaxed max-w-sm">
                                Jl. Pattimura No.20, Selong, Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta 12110, Indonesia.
                            </p>
                            <div className="mt-4 flex flex-col items-center md:items-start gap-2">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <a href="mailto:pusdatin@pu.go.id" className="hover:text-white transition-colors">pusdatin@pu.go.id</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span>(021) 7220219</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center md:items-end">
                         <h3 className="text-lg font-bold text-white mb-4">Lokasi Kami</h3>
                         <div className="overflow-hidden rounded-lg shadow-lg h-48 w-full max-w-md">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2123253962127!2d106.8002787!3d-6.2357197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1f738678eb5%3A0xf278895d9ede7ef3!2sPusat%20Data%20dan%20Teknologi%20Informasi%20(Pusdatin)%20Kementerian%20PUPR!5e0!3m2!1sid!2sid!4v1759728723410!5m2!1sid!2sid" 
                                className="w-full h-full border-0" 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                         </div>
                    </div>
                </div>
            </div>
            <div className="bg-yellow-500">
                <div className="container mx-auto px-6 py-4 text-center text-xs text-blue-900 font-medium">
                    <p>Copyright © {new Date().getFullYear()} Pusat Data dan Teknologi Informasi. Kementerian Pekerjaan Umum dan Perumahan Rakyat.</p>
                </div>
            </div>
        </footer>
    );
}

// Layout Utama
export default function MainAppLayout({ children }) {
    const pathname = usePathname();
    
    const [isSurveyModalOpen, setSurveyModalOpen] = useState(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <SmartHeader key={pathname} onAboutClick={() => setAboutModalOpen(true)} />
            <main className="flex-grow bg-slate-200">
                {children}
            </main>
            <NewFooter />
            
            <RateUsButton onClick={() => setSurveyModalOpen(true)} />
            <SurveyModal isOpen={isSurveyModalOpen} onClose={() => setSurveyModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
        </div>
    );
}