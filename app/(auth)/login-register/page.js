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
    
    // --- DIHAPUS: selectedRole tidak lagi dibaca dari URL ---

    const handleLogin = (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        const users = getUsers();
        
        // --- PERUBAHAN 1: Cari user HANYA berdasarkan email ---
        const user = users.find(u => u.email === email);
        
        if (user && user.password === password) {
            sessionStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, name: user.name, role: user.role }));
            
            // --- PERUBAHAN 2: Cek role SETELAH user ditemukan untuk redirect ---
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
            // --- PERUBAHAN 3: Setiap user baru otomatis 'user' ---
            users.push({ name, email, password, role: 'user' });
            saveUsers(users);
            return 'Registrasi berhasil! Silakan pindah ke tab Login.'; 
        }
    };
    
    return (
        <div className="bg-white p-12 rounded-lg shadow-xl w-full max-w-sm text-gray-800">
            <h1 className="text-4xl font-bold mb-10 text-center">
                {mode === 'signup' ? 'Register' : 'Log in'}
            </h1>
            
            {/* --- DIHAPUS: Teks 'Sebagai...' tidak perlu lagi --- */}

            {mode === 'signup' ? (
                <RegisterForm onRegister={handleRegister} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}

// --- Komponen Form (Tidak ada perubahan fungsionalitas) ---
function LoginForm({ onLogin }) {
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const loginError = onLogin(formData); 
        if (loginError) setError(loginError);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                <input name="email" type="email" placeholder="Username" className="w-full" required />
            </div>
            <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                <input name="password" type={passwordVisible ? 'text' : 'password'} placeholder="Password" className="w-full" required />
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="toggle-password">
                    {passwordVisible ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 4 10 4a9.95 9.95 0 00-4.522 1.052l-1.766-1.766zM6.579 6.579A3.001 3.001 0 0110 8c1.339 0 2.508.845 2.899 2.01l-4.32 4.32A3.001 3.001 0 016.579 6.579zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /></svg>}
                </button>
            </div>
            {error && (<p className="text-sm text-center text-red-600 font-semibold">{error}</p>)}
            <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-0" />
                    <span>Remember Me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors">
                Log in
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
                or <Link href="/login-register?mode=signup" className="text-blue-600 hover:underline font-semibold">Sign up</Link>
            </p>
        </form>
    );
}
function RegisterForm({ onRegister }) {
    const [message, setMessage] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const regMessage = onRegister(formData);
        setMessage(regMessage);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                <input name="name" type="text" placeholder="Full Name" className="w-full" required />
            </div>
            <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                <input name="email" type="email" placeholder="Username" className="w-full" required />
            </div>
            <div className="input-with-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                <input name="password" type={passwordVisible ? 'text' : 'password'} placeholder="Password" className="w-full" required />
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="toggle-password">
                    {/* ... (SVG eye icon) ... */}
                </button>
            </div>
            {message && (<p className="text-sm text-center font-semibold text-green-600">{message}</p>)}
            <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-bold hover:bg-black transition-colors">
                Register
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
                or <Link href="/login-register?mode=login" className="text-blue-600 hover:underline font-semibold">Log in</Link>
            </p>
        </form>
    );
}