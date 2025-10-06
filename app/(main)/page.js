"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

// Chart.js imports
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Import deskripsi untuk digabungkan dengan data API
import { descriptions } from '@/lib/table_descriptions';


ChartJS.register( ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const chartOptions = { responsive: true, maintainAspectRatio: false };

// --- Komponen-komponen Anak ---

function SearchForm() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    return (
        <form onSubmit={handleSearch} className="mt-8 w-full max-w-2xl bg-white/20 backdrop-blur-lg border border-white/30 rounded-full shadow-lg transition-all duration-300 focus-within:shadow-xl">
            <div className="relative">
                <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari dataset, API, atau lainnya..." className="w-full h-16 bg-transparent text-white placeholder-white/70 text-lg pl-8 pr-20 rounded-full focus:outline-none" />
                <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/30 hover:bg-white/50 text-white rounded-full h-10 w-10 flex items-center justify-center transition-colors" aria-label="Cari">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
        </form>
    );
}

function HeroStats({ stats, inView }) {
    const mainStat = { 
        label: "Data API Tersedia", 
        value: stats.tables, 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4" /></svg> 
    };
    const subStats = [
        { label: "Sumber Data", value: stats.sources },
        { label: "Unit Organisasi", value: stats.unor },
        { label: "Total Pengguna", value: stats.users }
    ];

    return (
        <div className="mt-8 w-full max-w-lg p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg flex flex-col items-center gap-3">
            <div className="text-center w-full pb-3 border-b border-white/30">
                <div className="flex justify-center items-center gap-3 text-white">
                    {mainStat.icon}
                    <span className="text-3xl font-bold">
                        {inView ? <CountUp end={mainStat.value} duration={2.5} separator="." /> : '0'}+
                    </span>
                </div>
                <p className="text-xs font-light text-white/90 mt-1">{mainStat.label}</p>
            </div>
            <div className="flex justify-around w-full pt-1">
                {subStats.map((item, index) => (
                    <div key={index} className="text-center text-white">
                        <p className="text-2xl font-bold">
                            {inView ? <CountUp end={item.value} duration={2.5} /> : '0'}
                        </p>
                        <p className="text-xs font-light opacity-80">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===================================================================================
// [REVISI] Komponen "Katalog Unggulan" diubah tata letak judulnya
// ===================================================================================
function FeaturedApis({ allApis, inView }) {
    const [popularApis, setPopularApis] = useState([]);
    const latestApis = allApis.slice(-3).reverse();

    useEffect(() => {
        try {
            const popularityData = JSON.parse(localStorage.getItem('apiPopularity')) || {};
            const sortedApis = [...allApis].sort((a, b) => {
                const countA = popularityData[a.tablename] || 0;
                const countB = popularityData[b.tablename] || 0;
                return countB - countA;
            });
            setPopularApis(sortedApis.slice(0, 3));
        } catch (e) {
            console.error("Gagal memuat data popularitas:", e);
            setPopularApis(allApis.slice(0, 3));
        }
    }, [allApis]);

    const ApiCard = ({ api }) => (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200/80 flex flex-col">
            <h4 className="font-bold text-gray-800">{api.tablename || 'Nama API tidak tersedia'}</h4>
            <p className="text-sm text-gray-600 mt-2 flex-grow min-h-[40px]">
                {api.deskripsi ? api.deskripsi.substring(0, 80) + '...' : 'Deskripsi tidak tersedia.'}
            </p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-semibold text-gray-500">{api.schemaname || 'Skema'}</span>
                <Link href={`/detail?table=${api.tablename}`} className="text-xs bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 transition-colors">
                    Lihat Detail
                </Link>
            </div>
        </div>
    );

    return (
        // [REVISI] Kontainer utama sekarang relatif untuk positioning link "Lihat Semua"
        <section className="relative bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="container mx-auto">
                {/* [REVISI] Link "Lihat Semua" diposisikan absolut di pojok kanan atas */}
                <Link href="/catalog" className={`absolute top-8 right-8 text-sm font-semibold text-blue-600 hover:underline ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    Lihat Semua &rarr;
                </Link>
                {/* [REVISI] Judul dan subjudul sekarang berada di dalam div `text-center` agar posisinya pas di tengah */}
                <div className="text-center mb-10">
                    <h2 className={`text-3xl font-bold text-gray-800 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        Katalog Unggulan
                    </h2>
                    <p className={`text-gray-600 mt-2 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                        Temukan API yang paling sering dilihat dan yang baru ditambahkan.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Kolom Kiri: Populer */}
                    <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                        <div className="bg-yellow-400 p-3 rounded-t-lg flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-900" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                           <h3 className="font-bold text-yellow-900">Dataset Populer</h3>
                        </div>
                        <div className="bg-white p-4 rounded-b-lg border-x border-b border-gray-200 flex flex-col gap-4">
                            {popularApis.map((api, index) => (
                                <ApiCard key={`pop-${api.tablename || index}`} api={api} />
                            ))}
                        </div>
                    </div>

                    {/* Kolom Kanan: Terbaru */}
                    <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                        <div className="bg-blue-400 p-3 rounded-t-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-900" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            <h3 className="font-bold text-blue-900">Dataset Terbaru</h3>
                        </div>
                        <div className="bg-white p-4 rounded-b-lg border-x border-b border-gray-200 flex flex-col gap-4">
                            {latestApis.map((api, index) => (
                                <ApiCard key={`new-${api.tablename || index}`} api={api} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Komponen Utama Halaman ---
export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [ { id: 1, image: "/unor1.jpg" }, { id: 2, image: "/unor2.jpg" }, { id: 3, image: "/unor3.jpg" } ];
    useEffect(() => {
        const slideInterval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
        return () => clearInterval(slideInterval);
    }, [slides.length]);

    const [stats, setStats] = useState({ tables: 0, sources: 0, unor: 0, users: 0 });
    const [allApiData, setAllApiData] = useState([]);

    const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const { ref: unorRef, inView: unorInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: howItWorksRef, inView: howItWorksInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        const dummyData = { tables: 78, sources: 1, unor: 6, users: 42 };
        setStats(dummyData);
        
        fetch('/api/catalog/tables') 
            .then(res => res.json())
            .then(apiData => {
                if (apiData && Array.isArray(apiData)) {
                    const enrichedData = apiData.map(api => ({
                        ...api,
                        deskripsi: descriptions[api.tablename] || '' 
                    }));
                    setAllApiData(enrichedData);
                }
            })
            .catch(err => console.error("Gagal mengambil data dari API:", err));
    }, []);
    
    return (
        <div>
            <section ref={heroRef} className="relative h-[85vh] w-full text-white overflow-hidden shadow-lg">
                {slides.map((slide, index) => (
                    <div key={slide.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${slide.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ))}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg"> Insight Hub</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl">Pusat Katalog dan Pertukaran Data Terintegrasi</p>
                    <SearchForm />
                    <HeroStats stats={stats} inView={heroInView} />
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`h-3 w-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`} />
                    ))}
                </div>
            </section>
            
            <div className="p-6 flex flex-col gap-8">
                <section ref={howItWorksRef} className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="container mx-auto">
                        <div className="text-center">
                            <h2 className={`text-3xl font-bold text-gray-800 mb-4 ${howItWorksInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                                Bagaimana Memulai?
                            </h2>
                            <p className={`text-gray-600 max-w-2xl mx-auto mb-12 ${howItWorksInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                                Ikuti tiga langkah mudah ini untuk menemukan dan memanfaatkan data yang Anda butuhkan.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                <div className={`flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${howItWorksInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                                    <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">1. Temukan Data</h3>
                                    <p className="text-gray-600 text-center text-sm">Gunakan fitur pencarian atau jelajahi katalog untuk menemukan informasi yang relevan.</p>
                                </div>
                                <div className={`flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${howItWorksInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                                    <div className="flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">2. Ajukan Permintaan</h3>
                                    <p className="text-gray-600 text-center text-sm">Setelah login, ajukan permintaan akses pada detail data dengan menjelaskan tujuan penggunaan.</p>
                                </div>
                                <div className={`flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${howItWorksInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
                                    <div className="flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">3. Integrasikan API</h3>
                                    <p className="text-gray-600 text-center text-sm">Gunakan API Key dan dokumentasi di API Explorer untuk mengintegrasikan data ke aplikasi Anda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <div ref={featuredRef}>
                    <FeaturedApis allApis={allApiData} inView={featuredInView} />
                </div>

                <section ref={unorRef} className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h2 className={`text-3xl font-bold text-gray-800 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`}>Jelajahi Data Berdasarkan Unit Organisasi</h2>
                            <p className={`text-gray-600 mt-2 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>Temukan data spesifik dari setiap Unit Organisasi di Kementerian PUPR.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                           <Link href="/catalog?unor=sda" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                                <Image src="https://img.icons8.com/pastel-glyph/64/1e3a8a/dam.png" width={64} height={64} alt="SDA Icon" className="h-16 w-16" />
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Sumber Daya Air</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait pengelolaan sumber daya air.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=bina_marga" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h-10.5a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h10.5a.75.75 0 00.75-.75V7.5a.75.75 0 00-.75-.75zM12 1.5A10.5 10.5 0 001.5 12a10.5 10.5 0 0010.5 10.5 10.5 10.5 0 0010.5-10.5A10.5 10.5 0 0012 1.5zM12 6.75v.007" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75h6v10.5H9V6.75z" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Bina Marga</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait penyelenggaraan jalan.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=cipta_karya" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5M5.25 6v15H3.75m16.5-15v15h1.5M9 6.75h6M9 11.25h6M9 15.75h6" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Cipta Karya</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait pengembangan kawasan permukiman.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=pembiayaan_infrastruktur" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m-3-1-3 1.091m0 3.818-3-1.091m0 0l-4.5 1.636m12-3.364-12 4.364" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Pembiayaan Infrastruktur</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait pembiayaan infrastruktur.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=bina_konstruksi" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
                                <Image src="https://img.icons8.com/ios/100/1e3a8a/architect.png" width={64} height={64} alt="Bina Konstruksi Icon" className="h-16 w-16" />
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Bina Konstruksi</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait pembinaan jasa konstruksi.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=prasarana_strategis" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
                                <Image src="https://img.icons8.com/dotty/80/1e3a8a/empty-bed.png" width={64} height={64} alt="BPIW Icon" className="h-16 w-16"/>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Direktorat Jenderal Prasarana Strategis</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait dukungan prasarana strategis.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                             <Link href="/catalog?unor=sekretariat_jenderal" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.9s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Sekretariat Jenderal</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data administrasi dan dukungan internal.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=inspektorat_jenderal" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '1.0s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5h.008v.008h-.008v-.008z" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Inspektorat Jenderal</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data pengawasan dan audit internal.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=bpsdm" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '1.1s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75a3.375 3.375 0 013.375 3.375m0 0c0 1.842-1.493 3.336-3.333 3.336h-1.5a3.336 3.336 0 01-3.333-3.336M9 5.25A3.375 3.375 0 0112.375 2a3.375 3.375 0 013.375 3.25" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Badan Pengembangan Sumber Daya Manusia</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data terkait pelatihan dan pengembangan SDM.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                            <Link href="/catalog?unor=bpiw" className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '1.2s'}}>
                                <svg className="h-16 w-16 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12v12m0 0l-3-3m3 3l3-3m-3.75 2.25L12 18.75l-2.25-2.25" /></svg>
                                <h3 className="text-lg font-bold text-gray-800 mt-4">Badan Pengembangan Infrastruktur Wilayah</h3>
                                <p className="text-xs text-gray-500 mt-1 flex-grow">Data perencanaan dan pengembangan infrastruktur.</p>
                                <span className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded-lg">Jelajahi Katalog</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Komponen ModalWrapper tidak diubah
function ModalWrapper({ show, onClose, title, children }) {
   return null;
}