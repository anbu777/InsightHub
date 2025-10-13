"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Menggunakan metode Supabase langsung, lebih andal daripada fetch manual
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            // Menangani berbagai jenis error dari Supabase
            if (signInError.message.includes('Invalid login credentials')) {
                setError('Login gagal. Periksa kembali email dan password Anda.');
            } else {
                setError('Terjadi kesalahan. Coba beberapa saat lagi.');
            }
            setIsLoading(false);
            return;
        }

        // Jika tidak ada error, Supabase sudah menangani sesi.
        // Cukup arahkan ke dashboard.
        router.refresh();
        router.push('/admin-dashboard');
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center auth-background">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800">
                <div>
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
                        Admin Login
                    </h1>
                    
                    {error && (<p className="mb-4 text-sm text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>)}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                                    required 
                                />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                    {passwordVisible ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 4 10 4a9.95 9.95 0 00-4.522 1.052l-1.766-1.766zM6.579 6.579A3.001 3.001 0 0110 8c1.339 0 2.508.845 2.899 2.01l-4.32 4.32A3.001 3.001 0 016.579 6.579zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /></svg>
                                    }
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Memproses...' : 'Log in'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Kembali ke{' '}
                        <Link href="/" className="font-semibold text-blue-600 hover:underline">
                            Halaman Utama
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
