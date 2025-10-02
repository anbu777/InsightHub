"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Helper Functions (Tidak Berubah) ---
function getUsers() {
    if (typeof window !== "undefined") {
        return JSON.parse(sessionStorage.getItem('allUsers')) || [
            { email: 'admin@pupr.go.id', password: 'adminpassword', name: 'Admin PUPR', role: 'admin' },
            { email: 'user1@pupr.go.id', password: 'userpassword', name: 'User Satu', role: 'user' },
        ];
    }
    return [];
}
function saveUsers(users) {
    sessionStorage.setItem('allUsers', JSON.stringify(users));
}

// --- Komponen Utama ---
export default function LoginRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'login'; 
    
    // --- Logika handleLogin & handleRegister (Tidak Berubah) ---
    const handleLogin = (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        const users = getUsers();
        
        const user = users.find(u => u.email === email);
        
        if (user && user.password === password) {
            sessionStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, name: user.name, role: user.role }));
            
            if (user.role === 'admin') {
                router.push('/admin-dashboard');
            } else {
                router.push('/');
            }
            return null; 
        }
        return 'Email atau Password salah!';
    };

    const handleRegister = (formData) => {
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        let users = getUsers();
        if (users.find(u => u.email === email)) {
            return 'Email sudah terdaftar!'; 
        } else {
            users.push({ name, email, password, role: 'user' });
            saveUsers(users);
            // Memberi pesan yang lebih baik, mengarahkan user untuk login
            router.push('/login-register?mode=login&status=registered');
            return null;
        }
    };
    
    return (
        // [REVISI] Mengubah padding dan max-width agar lebih seimbang
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800">
            {mode === 'signup' ? (
                <RegisterForm onRegister={handleRegister} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}


// ===================================================================================
// [REVISI TOTAL] Komponen LoginForm ditulis ulang dengan gaya yang lebih rapi
// ===================================================================================
function LoginForm({ onLogin }) {
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    // Cek apakah ada status registrasi berhasil dari URL
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const [successMessage, setSuccessMessage] = useState(status === 'registered' ? 'Registrasi berhasil! Silakan Log in.' : null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null); // Hapus pesan sukses saat mencoba login
        const formData = new FormData(event.target);
        const loginError = onLogin(formData); 
        if (loginError) setError(loginError);
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
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
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
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
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
                <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors">
                    Log in
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

// ===================================================================================
// [REVISI TOTAL] Komponen RegisterForm ditulis ulang dengan gaya yang lebih rapi
// ===================================================================================
function RegisterForm({ onRegister }) {
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.target);
        const regError = onRegister(formData);
        if (regError) setError(regError);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
                Create Account
            </h1>

            {error && (<p className="mb-4 text-sm text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md">{error}</p>)}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                        id="name"
                        name="name" 
                        type="text" 
                        placeholder="Nama Lengkap Anda" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        id="email-reg"
                        name="email" 
                        type="email" 
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
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
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
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
                <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors">
                    Register
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