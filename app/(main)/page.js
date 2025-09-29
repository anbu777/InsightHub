"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register( ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const chartOptions = { responsive: true, maintainAspectRatio: false };

export default function HomePage() {
    // State untuk Slider
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { id: 1, image: "/unor1.jpg" },
        { id: 2, image: "/unor2.jpg" },
        { id: 3, image: "/unor3.jpg" },
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    // State untuk Statistik & Modal
    const [stats, setStats] = useState({ tables: 0, sources: 0, unor: 0, users: 0 });
    const [globalApiData, setGlobalApiData] = useState([]);
    const [modalContent, setModalContent] = useState(null); 
    const [modalChartData, setModalChartData] = useState({ labels: [], datasets: [] });
    const [modalChartType, setModalChartType] = useState('pie'); 

    const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.5 });
    const { ref: unorRef, inView: unorInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        const dummyData = { tables: 78, sources: 1, unor: 6, users: 42 };
        setStats(dummyData);
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setGlobalApiData(data))
            .catch(err => console.error("Gagal fetch data.json", err));
    }, []);
    
    // Fungsi untuk menampilkan chart di modal
    const showChartSumberData = () => {
        const categoryCounts = globalApiData.reduce((acc, item) => {
            acc[item.kategori] = (acc[item.kategori] || 0) + 1;
            return acc;
        }, {});
        setModalChartData({ labels: Object.keys(categoryCounts), datasets: [{ label: 'Jumlah API', data: Object.values(categoryCounts), backgroundColor: ['#3B82F6', '#EF4444', '#10B981']}] });
        setModalChartType('pie');
        setModalContent('modal-sumber-data');
    };
    const showChartUnitOrganisasi = () => {
        const unorCounts = globalApiData.reduce((acc, item) => {
            acc[item.unor] = (acc[item.unor] || 0) + 1;
            return acc;
        }, {});
        setModalChartData({ labels: Object.keys(unorCounts), datasets: [{ label: 'Jumlah API', data: Object.values(unorCounts), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']}] });
        setModalChartType('bar');
        setModalContent('modal-unit-organisasi');
    };
    const renderModalChart = () => {
        if (!modalContent) return null;
        const chartKey = JSON.stringify(modalChartData);
        if (modalChartType === 'pie') return <Pie key={chartKey} data={modalChartData} options={chartOptions} />;
        if (modalChartType === 'bar') return <Bar key={chartKey} data={modalChartData} options={{...chartOptions, scales: { y: { beginAtZero: true } }}} />;
        return null;
    };

    return (
        <div className="space-y-8">
            {/* --- 1. HERO SLIDER BARU --- */}
            <section className="relative h-[60vh] md:h-[70vh] w-full text-white overflow-hidden rounded-xl shadow-lg">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${slide.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">PUPR Insight Hub</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl">Pusat Katalog dan Pertukaran Data Terintegrasi</p>
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`h-3 w-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`} />
                    ))}
                </div>
            </section>

            {/* --- 2. KONTAINER STATISTIK BARU --- */}
            <section ref={statsRef} className="bg-white py-12 md:py-16 rounded-xl shadow-lg">
                <div className="container mx-auto px-6">
                    <div className="text-center border-b pb-8 mb-8">
                        <div className="flex items-center justify-center text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4" /></svg>
                            <span className="ml-4 text-5xl md:text-6xl font-bold text-gray-800 tracking-tighter">
                                {statsInView && <CountUp end={stats.tables} duration={2.5} separator="." />}+
                            </span>
                        </div>
                        <p className="mt-2 text-lg text-gray-600">Data API Tersedia</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div onClick={showChartSumberData} className="cursor-pointer group">
                            <p className="text-4xl md:text-5xl font-bold text-gray-800">{statsInView && <CountUp end={stats.sources} duration={2.5} />}</p>
                            <p className="mt-1 text-gray-500 group-hover:text-blue-600 transition-colors">Sumber Data<span className="block w-12 h-1 bg-blue-500 mx-auto mt-2 transition-all group-hover:w-20"></span></p>
                        </div>
                        <div onClick={showChartUnitOrganisasi} className="cursor-pointer group">
                            <p className="text-4xl md:text-5xl font-bold text-gray-800">{statsInView && <CountUp end={stats.unor} duration={2.5} />}</p>
                            <p className="mt-1 text-gray-500 group-hover:text-indigo-600 transition-colors">Unit Organisasi<span className="block w-12 h-1 bg-indigo-500 mx-auto mt-2 transition-all group-hover:w-20"></span></p>
                        </div>
                        <div className="cursor-pointer group">
                            <p className="text-4xl md:text-5xl font-bold text-gray-800">{statsInView && <CountUp end={stats.users} duration={2.5} />}</p>
                            <p className="mt-1 text-gray-500 group-hover:text-green-600 transition-colors">Total Pengguna<span className="block w-12 h-1 bg-green-500 mx-auto mt-2 transition-all group-hover:w-20"></span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. SEKSI UNIT ORGANISASI (DIKEMBALIKAN) --- */}
            <section ref={unorRef} className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-bold text-gray-800 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`}>Jelajahi Data Berdasarkan Unit Organisasi</h2>
                    <p className={`text-gray-600 mt-2 ${unorInView ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>Temukan data spesifik dari setiap Unit Organisasi di Kementerian PUPR.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* SEMUA 6 KARTU UNOR DIKEMBALIKAN */}
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
                        <h3 className="text-lg font-bold text-gray-800 mt-4">Badan Pengembangan Infrastruktur Wilayah
Direktorat Jenderal Pembiayaan Infrastruktur</h3>
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
                </div>
            </section>
            
            <ModalWrapper show={!!modalContent} onClose={() => setModalContent(null)} title="Detail Statistik">
                 <div style={{height: '400px'}}>{renderModalChart()}</div>
            </ModalWrapper>
        </div>
    );
}

// Komponen Modal 
function ModalWrapper({ show, onClose, title, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
}