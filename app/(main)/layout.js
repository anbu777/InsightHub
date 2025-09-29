"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// --- (Footer dan BackToTopButton tidak diubah) ---
function NewFooter() {
    return (
        <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white border-t border-blue-700">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
                    <div className="flex-shrink-0">
                        <Image 
                            src="/LogoPUPR.png" 
                            alt="Logo Kementerian PUPR"
                            width={200}
                            height={60}
                            className="h-auto"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-white mb-2">
                            Pusat Data dan Teknologi Informasi
                        </h3>
                        <p className="text-sm leading-relaxed max-w-md mx-auto md:mx-0 text-blue-100">
                            Jl. Pattimura No.20, RT.2/RW.1, Selong, Kby. Baru,
                            Kota Jakarta Selatan, DKI Jakarta 12110, Indonesia.
                        </p>
                        <div className="mt-4 space-y-2 text-sm flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:pusdatin@pu.go.id" className="hover:text-white">pusdatin@pu.go.id</a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>(021) 7220219</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-yellow-500">
                <div className="container mx-auto px-6 py-4 text-center text-xs text-blue-900 font-medium">
                    <p>Copyright &copy; {new Date().getFullYear()} Pusat Data dan Teknologi Informasi. Kementerian Pekerjaan Umum dan Perumahan Rakyat.</p>
                </div>
            </div>
        </footer>
    );
}
function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) setIsVisible(true);
        else setIsVisible(false);
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                    aria-label="Kembali ke atas"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
            )}
        </div>
    );
}

// --- Komponen Header ---
function SmartHeader() {
    const [user, setUser] = useState(null);
    const router = useRouter(); 
    const pathname = usePathname(); 

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) setUser(JSON.parse(loggedInUser));
        else setUser(null);
    }, [pathname]); 

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        setUser(null);
        router.push('/'); 
    };

    return (
        <header className="text-white shadow-lg sticky top-0 z-50 bg-gradient-to-b from-blue-900 to-blue-800">
            <div className="container mx-auto px-6 py-3">
                <nav className="relative flex justify-between items-center">
                    <div className="flex-1 flex justify-start">
                        <Link href="/">
                            <Image 
                                src="/LogoInsight.png" 
                                alt="Logo Insight-Hub" 
                                width={120}
                                height={120}
                                className="h-40 w-auto"
                                priority 
                            />
                        </Link>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-8 text-sm">
                        <Link href="/" className="font-semibold hover:opacity-80 transition-opacity">Home</Link>
                        <Link href="/catalog" className="hover:opacity-80 transition-opacity">Katalog</Link>
                        <Link href="/api-explorer" className="hover:opacity-80 transition-opacity">API Explorer</Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">Tentang</Link> 
                    </div>
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
                            // --- PERBAIKAN DI SINI ---
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

// --- Layout Utama ---
export default function MainAppLayout({ children }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {isClient && <SmartHeader key={pathname} />}
            <main className="flex-grow bg-slate-100 p-6"> 
                {children}
            </main>
            <NewFooter />
            {isClient && <BackToTopButton />}
        </div>
    );
}