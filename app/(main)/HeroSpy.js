// app/(main)/HeroSpy.js

"use client";

import { useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { NavigationContext } from './contexts/NavigationContext';

export default function HeroSpy() {
    const { setActiveSection } = useContext(NavigationContext);
    const { ref, inView } = useInView({ threshold: 0.4 });

    useEffect(() => {
        if (inView && setActiveSection) {
            setActiveSection('hero');
        }
    }, [inView, setActiveSection]);

    // Komponen ini tidak merender apapun, hanya menempelkan ref
    // Ref akan ditempelkan ke elemen parent di page.js
    return <div ref={ref} className="absolute top-0 h-full w-full"></div>;
}