"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Toaster } from 'react-hot-toast'; // Import Toaster

// Import semua ikon yang kita butuhkan
import { 
    FaTachometerAlt, FaRocket, FaSignOutAlt, FaBell, FaCalendarAlt,
    FaChartBar, FaTable, FaFileAlt, FaListUl, FaEnvelope, FaUserCircle 
} from 'react-icons/fa';


// =====================================================================
// Komponen Sidebar (TIDAK ADA PERUBAHAN, SAMA SEPERTI KODE ANDA)
// =====================================================================
function Sidebar() {
    const pathname = usePathname();
    const isActive = (path) => pathname.startsWith(path);

    return (
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-400 min-h-screen">
            <div className="flex items-center justify-center h-20 bg-gray-900">
                <Image src="/LogoInsight.png" alt="Logo" width={240} height={40} />
            </div>
            <nav className="flex-grow px-4 py-6">
                <span className="px-4 text-xs font-semibold uppercase text-gray-500">Main</span>
                <Link href="/admin-dashboard" className={`flex items-center mt-2 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin-dashboard') ? 'bg-gray-700 text-white border-l-4 border-white' : 'hover:bg-gray-700 hover:text-white'}`}>
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </Link>
                
                <div className="mt-8">
                    <span className="px-4 text-xs font-semibold uppercase text-gray-500">Components</span>
                    <Link href="/notifications" className={`flex items-center mt-2 px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-white`}>
                       <FaBell className="mr-3" />
                       Notifications
                    </Link>
                </div>

                <div className="mt-8">
                    <span className="px-4 text-xs font-semibold uppercase text-gray-500">Plugins</span>
                    <Link href="/calendar" className={`flex items-center mt-2 px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-white`}>
                       <FaCalendarAlt className="mr-3" />
                       Calendar
                    </Link>
                     <Link href="/charts" className={`flex items-center mt-2 px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-white`}>
                       <FaChartBar className="mr-3" />
                       Charts
                    </Link>
                </div>
            </nav>
        </aside>
    );
}

// =====================================================================
// Komponen TopBar (REVISI HANYA PADA FUNGSI LOGOUT)
// =====================================================================
function TopBar() {
    const router = useRouter();
    const supabase = createClientComponentClient(); // Tambahkan Supabase client
    const [openMenu, setOpenMenu] = useState(null);

    // --- REVISI LOGIKA LOGOUT ---
    // Menggunakan metode logout dari Supabase yang benar
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Setelah sign out, onAuthStateChange di layout utama akan otomatis
        // mengarahkan ke halaman login. Kita bisa juga push ke halaman utama.
        router.push('/'); 
    };

    const handleMenuToggle = (menuName) => {
        setOpenMenu(prevMenu => (prevMenu === menuName ? null : menuName));
    };

    // Tampilan TopBar tidak diubah sama sekali
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
            <div className="text-gray-600">Home / Dashboard</div>
            <div className="flex items-center space-x-5">
                {/* Tombol Notifikasi */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('notifications')} className="text-gray-500 hover:text-gray-800">
                        <FaBell size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">2</span>
                    </button>
                    {openMenu === 'notifications' && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            {/* Konten dropdown notifikasi */}
                        </div>
                    )}
                </div>
                {/* Tombol Messages */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('messages')} className="text-gray-500 hover:text-gray-800">
                        <FaEnvelope size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">2</span>
                    </button>
                    {openMenu === 'messages' && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            {/* Konten dropdown pesan */}
                        </div>
                    )}
                </div>
                {/* Tombol User Profile */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('profile')} className="flex items-center space-x-2">
                        <FaUserCircle size={24} className="text-gray-600" />
                        <span className="text-sm text-gray-700 hidden sm:block">Halo, Admin</span>
                    </button>
                    {openMenu === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            <ul className="divide-y text-sm">
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 font-semibold">
                                    Logout
                                </button>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

// =====================================================================
// Layout Utama Admin (REVISI TOTAL PADA LOGIKA PENJAGA SESI)
// =====================================================================
export default function AdminLayout({ children }) {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [isLoading, setIsLoading] = useState(true);

    // --- REVISI LOGIKA PENJAGA SESI ---
    useEffect(() => {
        // Membuat 'pendengar' status otentikasi yang andal
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                // Jika tidak ada sesi (misalnya, setelah logout), usir ke halaman login
                router.replace('/admin-login');
            } else {
                // Jika ada sesi, berarti aman. Loading selesai.
                setIsLoading(false);
            }
        });

        // Hentikan 'pendengar' saat komponen tidak lagi digunakan
        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    if (isLoading) {
        // Tampilkan layar loading selagi memeriksa sesi
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Memverifikasi sesi admin...</p>
            </div>
        );
    }

    // Tampilan layout utama tidak diubah sama sekali
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster position="top-right" /> {/* Tambahkan ini untuk notifikasi */}
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="p-6 md:p-8 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}