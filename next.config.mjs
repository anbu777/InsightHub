/** @type {import('next').NextConfig} */
const nextConfig = {
  // Anda mungkin punya konfigurasi lain di sini

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // --- TAMBAHKAN BLOK INI ---
      {
        protocol: 'https',
        hostname: 'rezdrdyptxilpnrowshx.supabase.co', // <-- Hostname Supabase Anda
        port: '',
        pathname: '/storage/v1/object/public/**', // Izinkan semua path storage public
      },
      // --- BATAS TAMBAHAN ---
    ],
  },

  // Anda mungkin punya konfigurasi lain di sini
};

export default nextConfig;