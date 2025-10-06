"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// Komponen Header Cerdas untuk User
function SmartHeader() {
    const [user, setUser] = useState(null);
    const router = useRouter(); 
    const pathname = usePathname(); 

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        setUser(null);
        router.push('/'); 
    };

    // [REVISI] Fungsi untuk memberikan style pada link yang aktif
    const getLinkClassName = (path) => {
        // Cek jika path sama persis, atau jika path adalah /catalog dan URL mengandung /catalog
        const isActive = pathname === path || (path === '/catalog' && pathname.startsWith('/catalog'));
        return `transition-opacity ${isActive ? 'font-bold text-yellow-400' : 'font-semibold hover:opacity-80'}`;
    };

    return (
        <header className="text-white shadow-lg sticky top-0 z-50 bg-gradient-to-b from-blue-900 to-blue-800">
            <div className="container mx-auto px-6">
                <nav className="relative flex justify-between items-center">
                    {/* Logo di Kiri */}
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

                    {/* Menu Navigasi di Tengah */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-8 text-sm">
                        <Link href="/" className={getLinkClassName('/')}>Home</Link>
                        <Link href="/catalog" className={getLinkClassName('/catalog')}>Katalog</Link>
                        <Link href="#" className={getLinkClassName('/tentang')}>Tentang</Link> 
                    </div>

                    {/* Tombol Login/Logout di Kanan */}
                    <div className="flex-1 flex justify-end">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm hidden sm:block">Halo, {user.name.split(' ')[0]}</span>
                                <button 
                                    onClick={handleLogout} 
                                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/login-register" 
                                className="bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

// Komponen Footer
function NewFooter() {
    return (
        <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white border-t border-blue-700">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                    
                    {/* Kolom 1: Logo & Info Kontak */}
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

                    {/* Kolom 2: Peta Lokasi */}
                    <div className="w-full flex flex-col items-center md:items-end">
                         <h3 className="text-lg font-bold text-white mb-4">Lokasi Kami</h3>
                         {/* --- PERUBAHAN DI SINI: Ukuran peta diubah menjadi h-48 --- */}
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

    return (
        <div className="flex flex-col min-h-screen">
            <SmartHeader key={pathname} />
            <main className="flex-grow bg-slate-100"> 
                {children}
            </main>
            <NewFooter />
        </div>
    );
}