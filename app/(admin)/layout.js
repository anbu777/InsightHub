// app/(admin)/layout.js

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Toaster } from 'react-hot-toast';

// Import semua ikon yang kita butuhkan
import {
    FaTachometerAlt, FaSignOutAlt, FaBell,
    FaChartBar, FaTable, FaFileAlt, FaListUl, FaEnvelope, FaUserCircle,
    FaFolderOpen, FaTags // Tambahkan ikon baru
} from 'react-icons/fa';


// =====================================================================
// 🔹 Komponen Sidebar YANG DI REVISI 🔹
// =====================================================================
function Sidebar() {
    const pathname = usePathname();

    // Fungsi isActive yang lebih baik, menangani path yang lebih dalam
    const isActive = (path) => {
        // Highlight persis jika path sama, atau jika halaman saat ini dimulai dengan path tersebut
        // (misal, /admin/catalogs/new akan tetap menyorot /admin/catalogs)
        return pathname === path || pathname.startsWith(path + '/');
    };

    // Definisikan item navigasi dalam array agar lebih rapi
    const navItems = [
        { href: '/admin-dashboard', icon: FaTachometerAlt, label: 'Dashboard', section: 'Main' },
        { href: '/catalogs', icon: FaTable, label: 'Manajemen Katalog', section: 'Data Management' },
        { href: '/unors', icon: FaFolderOpen, label: 'Manajemen UNOR', section: 'Data Management' },
        { href: '/categories', icon: FaTags, label: 'Manajemen Kategori', section: 'Data Management' },
        { href: '/beritas', icon: FaFileAlt, label: 'Manajemen Berita', section: 'Data Management' },
        { href: '/requests', icon: FaEnvelope, label: 'Permintaan Data', section: 'User Interaction' },
        { href: '/feedback', icon: FaFileAlt, label: 'Feedback Pengguna', section: 'User Interaction' },
    ];

    // Kelompokkan item berdasarkan section
    const groupedNavItems = navItems.reduce((acc, item) => {
        acc[item.section] = acc[item.section] || [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-400 min-h-screen">
            <div className="flex items-center justify-center h-20 bg-gray-900">
                {/* Pastikan path logo benar */}
                <Image src="/LogoInsight.png" alt="Logo" width={240} height={40} className="w-auto h-40" />
            </div>
            <nav className="flex-grow px-4 py-6 space-y-6">
                {Object.entries(groupedNavItems).map(([section, items]) => (
                    <div key={section}>
                        <span className="px-4 text-xs font-semibold uppercase text-gray-500">{section}</span>
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center mt-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                    isActive(item.href)
                                        ? 'bg-gray-700 text-white border-l-4 border-yellow-400' // Highlight dengan warna berbeda
                                        : 'hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
}


// =====================================================================
// Komponen TopBar (Tidak Diubah, kecuali penyesuaian kecil)
// =====================================================================
function TopBar() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [openMenu, setOpenMenu] = useState(null);
    const [adminName, setAdminName] = useState('Admin'); // Default name

    // Ambil nama admin dari tabel profiles saat komponen dimuat
    useEffect(() => {
        const fetchAdminProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();
                
                if (profile && profile.full_name) {
                    setAdminName(profile.full_name);
                } else if (error) {
                    console.error("Error fetching admin profile:", error);
                }
            }
        };
        fetchAdminProfile();
    }, [supabase]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect ke halaman utama setelah logout
    };

    const handleMenuToggle = (menuName) => {
        setOpenMenu(prevMenu => (prevMenu === menuName ? null : menuName));
    };

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
            {/* Breadcrumb sederhana, bisa dibuat lebih dinamis nanti */}
            <div className="text-gray-600">Admin / Dashboard</div>
            <div className="flex items-center space-x-5">
                {/* Tombol Notifikasi & Pesan (Fungsionalitas belum ada) */}
                <div className="relative hidden"> {/* Sembunyikan sementara */}
                    <button onClick={() => handleMenuToggle('notifications')} className="text-gray-500 hover:text-gray-800">
                        <FaBell size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">0</span>
                    </button>
                    {openMenu === 'notifications' && ( <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down"></div> )}
                </div>
                 <div className="relative hidden"> {/* Sembunyikan sementara */}
                    <button onClick={() => handleMenuToggle('messages')} className="text-gray-500 hover:text-gray-800">
                        <FaEnvelope size={20} />
                         <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">0</span>
                    </button>
                     {openMenu === 'messages' && ( <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down"></div> )}
                </div>

                {/* Dropdown Profil Pengguna */}
                <div className="relative">
                    <button onClick={() => handleMenuToggle('profile')} className="flex items-center space-x-2">
                        <FaUserCircle size={24} className="text-gray-600" />
                        {/* Tampilkan nama admin */}
                        <span className="text-sm text-gray-700 hidden sm:block">Halo, {adminName}</span>
                    </button>
                    {openMenu === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border text-gray-800 animate-fade-in-down">
                            <ul className="divide-y text-sm">
                                {/* Opsi lain bisa ditambahkan di sini, misal "Pengaturan Akun" */}
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
// Layout Utama Admin (Tidak Diubah)
// =====================================================================
export default function AdminLayout({ children }) {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                router.replace('/admin-login');
            } else {
                setIsLoading(false);
            }
        });

        const checkInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/admin-login');
            } else {
                setIsLoading(false);
            }
        };

        checkInitialSession();

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600 font-medium">Memverifikasi sesi admin...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="p-6 md:p-8 flex-grow bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}