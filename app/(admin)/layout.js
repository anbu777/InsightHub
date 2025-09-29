"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Komponen Header Khusus Admin
function AdminHeader() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        setUser(null);
        router.push('/'); 
    };

    return (
        <header className="bg-gray-800 text-white shadow-lg z-20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Image src="/LogoInsight.png" alt="Logo PUPR" width={80} height={80} className="h-12 w-auto" />
                    <span className="text-xl font-semibold hidden sm:block">Admin Dashboard</span>
                </div>
                <nav className="flex items-center space-x-6 text-sm">
                    <Link href="/admin-dashboard" className="font-semibold text-white border-b-2 border-blue-400 pb-1">Dashboard</Link>
                    {/* Tambahkan link admin lain di sini jika perlu */}
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}

// Layout Utama untuk Admin
export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <AdminHeader />
            <main className="container mx-auto px-6 py-8 flex-grow">
                {children}
            </main>
            {/* Anda bisa menambahkan footer khusus admin di sini jika perlu */}
        </div>
    );
}