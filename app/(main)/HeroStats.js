// app/(main)/HeroStats.js

"use client";

import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

export default function HeroStats({ stats }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    const mainStat = { 
        label: "Dataset Tersedia", // Label diubah
        value: stats.datasets, // Data dari stats.datasets
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4" />
            </svg>
        )
    };
    
    // DIUBAH: subStats sekarang menggunakan data baru
    const subStats = [
        { label: "Jumlah Kategori", value: stats.categories },
        { label: "Unit Organisasi", value: stats.unors },
        { label: "Total Dilihat", value: stats.totalViews }
    ];

    return (
        <div ref={ref} className="mt-8 w-full max-w-2xl mx-auto p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg flex flex-col items-center gap-3">
            <div className="text-center w-full pb-3 border-b border-white/30">
                <div className="flex justify-center items-center gap-3 text-white">
                    {mainStat.icon}
                    <span className="text-3xl font-bold">
                        {inView ? <CountUp end={mainStat.value} duration={2.5} separator="." /> : '0'}
                    </span>
                </div>
                <p className="text-xs font-light text-white/90 mt-1">{mainStat.label}</p>
            </div>
            <div className="flex justify-around w-full pt-1">
                {subStats.map((item, index) => (
                    <div key={index} className="text-center text-white">
                        <p className="text-2xl font-bold">
                            {inView ? <CountUp end={item.value} duration={2.5} separator="." /> : '0'}
                        </p>
                        <p className="text-xs font-light opacity-80">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}