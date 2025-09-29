/** @type {import('next').NextConfig} */
const nextConfig = {
  // TAMBAHKAN BLOK INI:
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;