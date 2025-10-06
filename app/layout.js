// File: app/layout.js

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

// TIDAK PERLU inisialisasi ulang, karena font yang diimpor sudah merupakan objek jadi.

export const metadata = {
  title: 'PU Insight Hub',
  description: 'Pusat Katalog dan Pertukaran Data Terintegrasi PUPR',
};

export default function RootLayout({ children }) {
  return (
    // Langsung gunakan properti .variable dari font yang diimpor
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}