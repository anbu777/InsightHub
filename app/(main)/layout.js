"use client"; 

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavigationContext } from './contexts/NavigationContext';

// --- Komponen-komponen Modal ---
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
                    <h2 className="text-2xl font-bold text-gray-800">Survey Kepuasan Insight Hub</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Terima kasih telah menggunakan Insight Hub. Kami menghargai masukan Anda untuk meningkatkan kualitas layanan dan sistem pengelolaan data kami.</p>
                <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nama <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required />
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
                            <select name="age" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required>
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
                            <label className="block text-sm font-medium mb-2">Bagaimana pendapat Anda tentang Insight Hub? <span className="text-red-500">*</span></label>
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
                            <label className="block text-sm font-medium mb-2">Bagaimana teknis penyajian data Insight Hub? <span className="text-red-500">*</span></label>
                            <div className="flex justify-around items-center opacity-50 cursor-not-allowed">
                                {['😡', '☹️', '😐', '🙂', '😄'].map((emoji, index) => <span key={index} className="text-4xl p-2">{emoji}</span>)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="suggestion" className="block text-sm font-medium mb-1">Menurut Anda, fitur apa yang perlu ditingkatkan pada Insight Hub?</label>
                        <textarea id="suggestion" name="suggestion" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]"></textarea>
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
                    <p><strong>Insight Hub</strong> adalah sebuah platform terpusat yang dirancang untuk menjadi gerbang utama dalam mengakses dan memanfaatkan data di lingkungan Kementerian Pekerjaan Umum.</p>
                    <p>Platform ini berfungsi sebagai katalog data terintegrasi yang memungkinkan pengguna, baik dari internal kementerian maupun publik, untuk dengan mudah menemukan, menjelajahi, dan mengajukan permintaan akses terhadap berbagai set data yang tersedia.</p>
                    <p>Dengan adanya Insight Hub, kami bertujuan untuk meningkatkan transparansi, mendorong inovasi berbasis data, dan memfasilitasi pertukaran informasi yang efisien untuk mendukung pengambilan keputusan yang lebih baik dalam pembangunan infrastruktur nasional.</p>
                </div>
                <div className="text-right mt-8">
                    <button onClick={onClose} className="bg-[#0D2A57] text-white font-bold py-2 px-6 rounded-md hover:bg-[#0D2A57]/90 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
}
function RequestDataModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Terima kasih! Pengajuan Anda akan kami proses.');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Formulir Pengajuan Data</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Tidak menemukan data yang Anda cari? Silakan isi formulir di bawah ini untuk mengajukan data baru.</p>
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="req_name" className="block text-sm font-medium mb-1">Nama Lengkap<span className="text-red-500">*</span></label>
                            <input type="text" id="req_name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required />
                        </div>
                        <div>
                            <label htmlFor="req_phone" className="block text-sm font-medium mb-1">Nomor Telepon<span className="text-red-500">*</span></label>
                            <input type="tel" id="req_phone" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="req_email" className="block text-sm font-medium mb-1">Email<span className="text-red-500">*</span></label>
                            <input type="email" id="req_email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required />
                        </div>
                        <div>
                            <label htmlFor="req_entity" className="block text-sm font-medium mb-1">Instansi / Perorangan<span className="text-red-500">*</span></label>
                            <select id="req_entity" name="entity" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required>
                                <option value="">Pilih salah satu...</option>
                                <option value="instansi">Instansi</option>
                                <option value="perorangan">Perorangan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="req_data_type" className="block text-sm font-medium mb-1">Jenis Data yang Dibutuhkan<span className="text-red-500">*</span></label>
                        <textarea id="req_data_type" name="dataType" rows="4" placeholder="Jelaskan secara rinci data yang Anda butuhkan..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D2A57]" required></textarea>
                    </div>
                    <div className="text-right pt-4">
                        <button type="submit" className="bg-[#0D2A57] text-white font-bold py-2 px-6 rounded-md hover:bg-[#0D2A57]/90 transition-colors">Kirim Pengajuan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function SidebarMenu({ isOpen, onClose, onAboutClick, onRequestDataClick, onSurveyClick }) {
    const pathname = usePathname();
    const getLinkClassName = (path) => {
        const isActive = pathname.startsWith(path);
        if (isActive) {
            return "w-full text-left px-4 py-3 rounded-md font-bold bg-yellow-400/20 text-[#0D2A57] transition-colors";
        }
        return "w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#0D2A57] font-semibold transition-colors";
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            ></div>
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg text-gray-800">Menu</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="p-4 flex flex-col space-y-2">
                    <Link href="/catalog" className={getLinkClassName('/catalog')}>Katalog Data</Link> 
                    <Link href="/api-explorer" className={getLinkClassName('/api-explorer')}>Api Explorer</Link> 
                    <button onClick={onRequestDataClick} className="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#0D2A57] font-semibold transition-colors">Pengajuan Data</button>
                    <button onClick={onAboutClick} className="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#0D2A57] font-semibold transition-colors">Tentang</button>
                    <button onClick={onSurveyClick} className="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-[#0D2A57] font-semibold transition-colors">Beri Penilaian</button>
                </nav>
            </div>
        </>
    );
}

// Komponen Header
function SmartHeader({ onMenuClick }) {
    const pathname = usePathname(); 
    const { activeSection } = useContext(NavigationContext);

    const getLinkClassName = (sectionId) => {
        const baseClasses = "px-4 py-2 rounded-full transition-colors duration-200 font-semibold text-white hover:bg-white/10";
        if (activeSection === sectionId) {
            return "px-4 py-2 rounded-full transition-colors duration-200 font-bold bg-yellow-400 text-[#0D2A57]";
        }
        return baseClasses;
    };

    return (
        <header className="text-white shadow-lg sticky top-0 z-40 bg-[#0D2A57]">
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
                        {pathname === '/' && (
                            <>
                                <Link href="/#hero" className={getLinkClassName('hero')}>Beranda</Link>
                                <Link href="/#how-it-works" className={getLinkClassName('how-it-works')}>Cara Kerja</Link>
                                <Link href="/#featured-catalog" className={getLinkClassName('featured-catalog')}>Unggulan</Link>
                                <Link href="/#unor-section" className={getLinkClassName('unor-section')}>Unit Organisasi</Link>
                            </>
                        )}
                    </div>

                    <div className="flex-1 flex justify-end">
                        <button onClick={onMenuClick} className="p-2 rounded-full text-white hover:bg-white/10" aria-label="Buka menu">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

// Komponen Footer
function NewFooter() {
    return (
        <footer className="bg-[#0D2A57] text-white border-t border-white/10">
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
            <div className="bg-yellow-400">
                <div className="container mx-auto px-6 py-4 text-center text-xs text-[#0D2A57] font-bold">
                    <p>Copyright © {new Date().getFullYear()} Pusat Data dan Teknologi Informasi. Kementerian Pekerjaan Umum.</p>
                </div>
            </div>
        </footer>
    );
}

// Layout Utama
export default function MainAppLayout({ children }) {
    const pathname = usePathname();
    
    // State untuk semua modal
    const [isSurveyModalOpen, setSurveyModalOpen] = useState(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isRequestDataModalOpen, setRequestDataModalOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    
    const [activeSection, setActiveSection] = useState('hero');

    const handleRequestDataClick = () => {
        setMenuOpen(false);
        setRequestDataModalOpen(true);
    };
    const handleAboutClick = () => {
        setMenuOpen(false);
        setAboutModalOpen(true);
    };
    const handleSurveyClick = () => {
        setMenuOpen(false);
        setSurveyModalOpen(true);
    };

    return (
        <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
            <div className="flex flex-col min-h-screen">
                <SmartHeader 
                    key={pathname} 
                    onMenuClick={() => setMenuOpen(true)}
                />
                <main className="flex-grow bg-[#F8F9FA]">
                    {children}
                </main>
                <NewFooter />
                
                {/* Semua modal dirender di sini */}
                <SurveyModal isOpen={isSurveyModalOpen} onClose={() => setSurveyModalOpen(false)} />
                <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
                <RequestDataModal isOpen={isRequestDataModalOpen} onClose={() => setRequestDataModalOpen(false)} />
                
                <SidebarMenu 
                    isOpen={isMenuOpen} 
                    onClose={() => setMenuOpen(false)}
                    onRequestDataClick={handleRequestDataClick}
                    onAboutClick={handleAboutClick}
                    onSurveyClick={handleSurveyClick}
                />
            </div>
        </NavigationContext.Provider>
    );
}