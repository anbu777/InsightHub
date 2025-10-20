// app/(main)/page.js

import { supabase } from '@/lib/supabaseClient';
import HeroSlider from './HeroSlider';
import SearchForm from './SearchForm';
import HeroStats from './HeroStats';
import HeroSpy from './HeroSpy'; // Impor komponen spy baru
import PageSections from './PageSections'; // Impor komponen section baru

// Fungsi getStats tetap sama
async function getStats() {
    const [
        { count: datasetsCount },
        { count: unorsCount },
        { count: categoriesCount },
        { data: totalViewsData, error: rpcError }
    ] = await Promise.all([
        supabase.from('datasets').select('*', { count: 'exact', head: true }),
        supabase.from('unors').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.rpc('get_total_clicks')
    ]);

    if (rpcError) console.error("Error calling RPC function:", rpcError);

    return {
        datasets: datasetsCount ?? 0,
        unors: unorsCount ?? 0,
        categories: categoriesCount ?? 0,
        totalViews: totalViewsData ?? 0,
    };
}

// Urutan UNOR tetap sama
const unorOrder = [
    "Sekretariat Jenderal",
    "Direktorat Jenderal Sumber Daya Air",
    "Direktorat jenderal Bina Marga",
    "Direktorat jenderal Cipta Karya",
    "Direktorat Jenderal Prasarana Strategis",
    "Direktorat Jenderal Bina Konstruksi",
    "Direktorat Jenderal Pembiayaan Infrastruktur",
    "Inspektorat Jenderal",
    "Badan Pengembangan Infrastruktur Wilayah",
    "Badan Pengembangan Wilayah Sumber Daya Manusia",
];

// Komponen Halaman Utama (Server Component)
export default async function HomePage() {
    // Ambil semua data di server
    const [stats, featuredData, latestData, unorsResult] = await Promise.all([
        getStats(),
        supabase.from('datasets').select('id, title, description').order('click_count', { ascending: false }).limit(3),
        supabase.from('datasets').select('id, title, description').order('created_at', { ascending: false }).limit(3),
        supabase.from('unors').select('*'),
    ]);
    
    // Urutkan UNOR di server
    const sortedUnors = unorsResult.data?.sort((a, b) => unorOrder.indexOf(a.nama_unor) - unorOrder.indexOf(b.nama_unor)) || [];

    // Cek error
    if (featuredData.error || latestData.error || unorsResult.error) {
        console.error("Error fetching homepage data:", featuredData.error || latestData.error || unorsResult.error);
    }

    // Render komponen, delegasikan data dan tugas interaktif ke komponen client
    return (
        <div>
            <section id="hero" className="relative min-h-[50rem] w-full flex text-white overflow-hidden shadow-lg">
                <HeroSpy /> {/* Komponen ini akan melacak scroll untuk section hero */}
                <HeroSlider />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg animate-fade-in-down">Insight Hub</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                        Pusat Katalog dan Pertukaran Data Terintegrasi
                    </p>
                    <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <SearchForm />
                    </div>
                    <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <HeroStats stats={stats} />
                    </div>
                </div>
            </section>
            
            {/* Delegasikan rendering semua section lain ke PageSections */}
            <PageSections
                featuredData={featuredData.data}
                latestData={latestData.data}
                sortedUnors={sortedUnors}
            />
        </div>
    );
}