"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Import semua ikon yang kita butuhkan
import { 
    FaTachometerAlt, FaRocket, FaSignOutAlt, FaBell, FaCalendarAlt,
    FaChartBar, FaTable, FaFileAlt, FaListUl, FaEnvelope, FaUserCircle 
} from 'react-icons/fa';


// Komponen Sidebar (Tidak Berubah)
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
                <Link href="/api-explorer" className={`flex items-center mt-2 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/api-explorer') ? 'bg-gray-700 text-white border-l-4 border-white' : 'hover:bg-gray-700 hover:text-white'}`}>
                    <FaRocket className="mr-3" />
                    API Explorer
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

// --- PERUBAHAN UTAMA DI SINI: Komponen TopBar ---
function TopBar() {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(null); // State untuk mengontrol dropdown

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        router.push('/'); 
    };

    const handleMenuToggle = (menuName) => {
        setOpenMenu(prevMenu => (prevMenu === menuName ? null : menuName));
    };

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
            <div className="text-gray-600">Home / Dashboard</div>
            
            <div className="flex items-center space-x-5">
                {/* 1. Tombol Notifikasi */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('notifications')} className="text-gray-500 hover:text-gray-800">
                        <FaBell size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">5</span>
                    </button>
                    {openMenu === 'notifications' && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            <div className="p-4 font-bold border-b">You have 5 notifications</div>
                            <ul className="divide-y max-h-80 overflow-y-auto">
                                <li className="p-4 hover:bg-gray-50 text-sm cursor-pointer">New user registered</li>
                                <li className="p-4 hover:bg-gray-50 text-sm cursor-pointer">Server overloaded</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* 2. Tombol Messages (Chat) */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('messages')} className="text-gray-500 hover:text-gray-800">
                        <FaEnvelope size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">2</span>
                    </button>
                    {openMenu === 'messages' && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            <div className="p-4 font-bold border-b">You have 2 messages</div>
                            <ul className="divide-y max-h-80 overflow-y-auto">
                               <li className="p-4 hover:bg-gray-50 text-sm cursor-pointer">
                                   <div className="font-bold">Jessica Williams</div>
                                   <div>Project update meeting tomorrow...</div>
                               </li>
                               <li className="p-4 hover:bg-gray-50 text-sm cursor-pointer">
                                   <div className="font-bold">Budi (SDA)</div>
                                   <div>Permintaan data tabel bendungan...</div>
                               </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* 3. Tombol User Profile */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('profile')} className="flex items-center space-x-2">
                        <FaUserCircle size={24} className="text-gray-600" />
                        <span className="text-sm text-gray-700 hidden sm:block">Halo, Admin</span>
                    </button>
                    {openMenu === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            <ul className="divide-y text-sm">
                                <Link href="#" className="block px-4 py-3 hover:bg-gray-100">Settings</Link>
                                <Link href="#" className="block px-4 py-3 hover:bg-gray-100">Profile</Link>
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

// Layout Utama Admin
export default function AdminLayout({ children }) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        const userData = user ? JSON.parse(user) : null;
        if (!userData || userData.role !== 'admin') {
            router.push('/login-register');
        }
        setIsClient(true);
    }, [router]);

    if (!isClient) {
        return null; // Mencegah hydration error
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
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