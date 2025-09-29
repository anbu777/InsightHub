import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full auth-background text-white relative">
      
      {/* Header Khusus Halaman Auth - Menyerupai Desain */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image 
              src="/LogoInsight.png" // Ganti dengan logo baru Anda jika perlu
              alt="Insight Hub PU"
              width={150}
              height={40}
              className="h-auto w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold uppercase">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <a href="#" className="hover:text-gray-300 transition-colors">About Us</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
            <Link href="/login-register" className="text-white border px-4 py-2 rounded-md hover:bg-white hover:text-blue-900 transition-colors">
              Log In
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Konten (kartu login/register/role) akan dirender di sini */}
      <main className="min-h-screen w-full flex items-center justify-center pt-24 pb-8 px-4">
        {children}
      </main>
    </div>
  );
}