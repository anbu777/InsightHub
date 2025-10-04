import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    // [REVISI] Pembungkus utama bertanggung jawab penuh atas background dan tinggi halaman
    <div className="min-h-screen w-full auth-background text-white relative flex flex-col">
      
      {/* Header Khusus Halaman Auth */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image 
              src="/LogoInsight.png"
              alt="Insight Hub PU"
              width={150}
              height={40}
              className="h-auto w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold uppercase">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/login-register" className="text-white border px-4 py-2 rounded-md hover:bg-white hover:text-blue-900 transition-colors">
              Log In
            </Link>
          </nav>
        </div>
      </header>
      
      {/* [REVISI] <main> sekarang menjadi flex container untuk menengahkan konten (children) */}
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}