// app/(main)/HeroSlider.js

"use client";

import { useState, useEffect } from 'react';

// Data untuk slides bisa disimpan di sini atau diambil dari props jika dinamis
const slides = [
    { id: 1, image: "/unor1.jpg" },
    { id: 2, image: "/unor2.jpg" },
    { id: 3, image: "/unor3.jpg" }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // useEffect untuk menangani interval pergantian slide otomatis
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000); // Ganti slide setiap 5 detik

        // Cleanup function untuk membersihkan interval saat komponen dilepas
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <>
            {/* Bagian untuk menampilkan gambar slide */}
            {slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} 
                    style={{ 
                        backgroundImage: `url('${slide.image}')`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' 
                    }} 
                />
            ))}
            
            {/* Bagian untuk tombol navigasi slide (dots) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
                {slides.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setCurrentSlide(index)} 
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`} 
                    />
                ))}
            </div>
        </>
    );
}