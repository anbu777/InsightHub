// app/(main)/detail/[id]/page.js

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DetailClientComponent from './DetailClientComponent'; // Komponen Client untuk interaktivitas

// Fungsi ini mengambil data spesifik dari Supabase di server
async function getDataset(id) {
    const { data, error } = await supabase
        .from('datasets')
        .select('*, categories(nama_kategori), unors(nama_unor)') // Query relasional
        .eq('id', id)
        .single(); // .single() untuk mengambil satu data atau error jika tidak ada

    // Jika data tidak ditemukan, tampilkan halaman 404
    if (error || !data) {
        notFound();
    }
    return data;
}

// Ini adalah Server Component utama untuk halaman detail
export default async function DetailPage({ params }) {
    // params.id berisi ID dari URL (misal: /detail/abc-123)
    const dataset = await getDataset(params.id);

    return (
        <div className="container mx-auto px-6 py-12">
            <Link href="/catalog" className="text-[#0D2A57] hover:underline mb-6 inline-block">
                &larr; Kembali ke Katalog
            </Link>
            
            {/* Render komponen Client dan kirim data dari server sebagai props.
              Semua interaktivitas (state untuk tab, modal, dll.) akan ditangani di dalam DetailClientComponent.
            */}
            <DetailClientComponent dataset={dataset} />
        </div>
    );
}