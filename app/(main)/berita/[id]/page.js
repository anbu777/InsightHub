// app/(main)/berita/[id]/page.js

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fungsi untuk mengambil data berita berdasarkan ID
async function getNewsDetail(id) {
    const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single(); // Ambil satu baris saja

    if (error || !data) {
        console.error("Error fetching news detail:", error);
        return null; // Kembalikan null jika error atau data tidak ditemukan
    }
    return data;
}

// Format tanggal (opsional, tapi bagus untuk tampilan)
function formatDate(isoString) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
         // Opsi format tanggal yang lebih lengkap
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
        // Gunakan locale 'id-ID' untuk Bahasa Indonesia
        return date.toLocaleDateString('id-ID', options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return ''; // Kembalikan string kosong jika format gagal
    }
   
}


// Komponen Halaman Detail Berita (Server Component)
export default async function NewsDetailPage({ params }) {
    const newsId = params.id;
    const newsItem = await getNewsDetail(newsId);

    // Jika berita tidak ditemukan, tampilkan halaman 404
    if (!newsItem) {
        notFound();
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            {/* Tombol Kembali */}
            <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Kembali ke Beranda
            </Link>

            {/* Judul Berita */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{newsItem.title}</h1>
            
            {/* Tanggal Publikasi (jika ada created_at) */}
             <p className="text-sm text-gray-500 mb-6">
                 Dipublikasikan pada: {formatDate(newsItem.created_at)}
             </p>


            {/* Gambar Utama Berita */}
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={newsItem.image_url}
                    alt={newsItem.title}
                    layout="fill"
                    objectFit="cover"
                    priority // Prioritaskan gambar utama
                />
            </div>

            {/* Konten Lengkap Berita */}
            {/* Gunakan div dengan class 'prose' dari Tailwind Typography jika Anda menggunakannya,
                atau format manual seperti di bawah */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                {/* Kita split konten berdasarkan baris baru (\n) dan render sebagai paragraf */}
                {newsItem.content ? (
                    newsItem.content.split('\n').map((paragraph, index) => (
                        // Abaikan paragraf kosong
                        paragraph.trim() ? <p key={index}>{paragraph}</p> : null 
                    ))
                ) : (
                    // Tampilkan excerpt jika content kosong
                    <p>{newsItem.excerpt}</p> 
                )}
            </div>

             {/* Tautan Sumber (jika ada) */}
             {newsItem.source_url && (
                 <div className="mt-8 pt-6 border-t">
                     <p className="text-sm text-gray-600">
                         Sumber asli:{' '}
                         <a 
                            href={newsItem.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                         >
                            Lihat di Instagram
                         </a>
                     </p>
                 </div>
             )}
        </div>
    );
}

// Fungsi untuk metadata (Opsional, tapi bagus untuk SEO)
export async function generateMetadata({ params }) {
    const newsId = params.id;
    const newsItem = await getNewsDetail(newsId);
  
    if (!newsItem) {
      return {
        title: 'Berita Tidak Ditemukan',
      }
    }
  
    return {
      title: `${newsItem.title} | Insight Hub`,
      description: newsItem.excerpt,
      // Anda bisa menambahkan openGraph metadata di sini jika perlu
    }
}