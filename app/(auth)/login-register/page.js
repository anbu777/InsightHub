"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Komponen untuk Form Login
function LoginForm({ onLogin, error, successMessage, isLoading }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin({ email, password });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
                Log in
            </h1>
            
            {error && (<p className="mb-4 text-sm text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>)}
            {successMessage && (<p className="mb-4 text-sm text-center text-green-800 font-semibold bg-green-100 p-3 rounded-md">{successMessage}</p>)}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
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
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span>Remember Me</span>
                    </label>
                    <a href="#" className="font-medium text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors disabled:bg-gray-400">
                    {isLoading ? 'Memproses...' : 'Log in'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Belum punya akun?{' '}
                <Link href="/login-register?mode=signup" className="font-semibold text-blue-600 hover:underline">
                    Daftar di sini
                </Link>
            </p>
        </div>
    );
}

// Komponen untuk Form Registrasi
function RegisterForm({ onRegister, error, isLoading }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        onRegister({ name, email, password });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Create Account</h1>
            {error && (<p className="mb-4 text-sm text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>)}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                        id="name"
                        name="name" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Lengkap Anda" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        id="email-reg"
                        name="email" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="password-reg"className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input 
                            id="password-reg" 
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
                    {isLoading ? 'Memproses...' : 'Register'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Sudah punya akun?{' '}
                <Link href="/login-register?mode=login" className="font-semibold text-blue-600 hover:underline">
                    Login di sini
                </Link>
            </p>
        </div>
    );
}

// Komponen Utama yang Mengelola Logika
export default function LoginRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'login';
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get('status') === 'registered') {
            setSuccessMessage('Registrasi berhasil! Silakan Log in.');
        }
    }, [searchParams]);
    
    // PERUBAHAN: Logika handleLogin sekarang terhubung ke API
    const handleLogin = async ({ email, password }) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            sessionStorage.setItem('loggedInUser', JSON.stringify(data));
            if (data.role === 'admin') {
                router.push('/admin-dashboard');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat login.');
        } finally {
            setIsLoading(false);
        }
    };

    // PERUBAHAN: Logika handleRegister sekarang terhubung ke API
    const handleRegister = async ({ name, email, password }) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            router.push('/login-register?mode=login&status=registered');
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat registrasi.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen" style={{backgroundImage: "url('/auth-bg.png')", backgroundSize: 'cover'}}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800">
                {mode === 'signup' ? (
                    <RegisterForm onRegister={handleRegister} error={error} isLoading={isLoading} />
                ) : (
                    <LoginForm onLogin={handleLogin} error={error} successMessage={successMessage} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
}