// app/(main)/detail/[id]/page.js

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DetailClientComponent from './DetailClientComponent';
import Image from 'next/image';

async function getDataset(id) {
    // ... (Fungsi getDataset tetap sama seperti sebelumnya) ...
    if (!id) {
        console.error("getDataset called without valid ID");
        notFound();
    }
    console.log(`Fetching dataset with ID: ${id}`);
    const { data, error } = await supabase
        .from('datasets')
        .select('*, categories(nama_kategori), unors(nama_unor)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching dataset ${id}:`, error.message);
        if (error.code === 'PGRST116') {
             console.log(`Dataset with ID ${id} not found.`);
            notFound();
        }
        throw new Error(`Supabase error: ${error.message}`);
    }
     if (!data) {
         console.log(`Dataset with ID ${id} not found (data is null).`);
        notFound();
     }
    return data;
}

// Komponen Halaman Detail
export default async function DetailPage({ params }) {
    // --- MODIFIKASI: Gunakan Destructuring ---
    const { id: datasetId } = params; // Ekstrak 'id' dan beri nama alias 'datasetId'
    // --- BATAS MODIFIKASI ---

    if (!datasetId) {
        console.error("DetailPage received invalid params (no id):", params);
        notFound();
    }

    // ... (try...catch block tetap sama seperti sebelumnya) ...
    try {
        const dataset = await getDataset(datasetId);
        return (
            <div className="container mx-auto px-6 py-12">
                <Link href="/catalog" className="inline-flex items-center text-blue-600 hover:underline mb-8 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 inline transition-transform duration-200 group-hover:-translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
                <DetailClientComponent dataset={dataset} />
            </div>
        );
    } catch (error) {
         console.error("Error rendering DetailPage:", error);
         if (error.message.includes('not found') || error.message.includes('PGRST116')) {
             notFound();
         }
         return (
             <div className="container mx-auto px-6 py-12 text-center">
                 {/* ... (Fallback UI Error tetap sama) ... */}
                  <Link href="/catalog" className="inline-flex items-center text-blue-600 hover:underline mb-8 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 inline transition-transform duration-200 group-hover:-translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
                <p className="text-red-600 mt-8">Terjadi kesalahan saat memuat detail dataset. Silakan coba lagi nanti.</p>
                {process.env.NODE_ENV === 'development' && (
                    <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
                        {error.stack || error.message}
                    </pre>
                )}
             </div>
         );
    }
}

// Generate Metadata
export async function generateMetadata({ params }) {
    // --- MODIFIKASI: Gunakan Destructuring ---
    const { id: datasetId } = params; // Ekstrak 'id' dan beri nama alias 'datasetId'
    // --- BATAS MODIFIKASI ---

    if (!datasetId) {
        return { title: 'Parameter Tidak Valid | Insight Hub' };
    }

    // ... (try...catch block tetap sama seperti sebelumnya) ...
    try {
        const { data, error } = await supabase
            .from('datasets')
            .select('title, description')
            .eq('id', datasetId)
            .single();

        if (error || !data) {
             console.warn(`Metadata generation failed for ID ${datasetId}: Dataset not found or error occurred.`);
             return { title: 'Dataset Tidak Ditemukan | Insight Hub', description: 'Dataset yang Anda cari tidak ditemukan.', }
        }

        return {
          title: `${data.title || 'Detail Dataset'} | Insight Hub`,
          description: data.description || 'Detail dataset dari Insight Hub PUPR.',
        }
    } catch (error) {
         console.error("Unexpected error generating metadata:", error);
         return { title: 'Error Memuat Metadata | Insight Hub', description: 'Terjadi kesalahan saat memuat informasi halaman.', }
    }
}