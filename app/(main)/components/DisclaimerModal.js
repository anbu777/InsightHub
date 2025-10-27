// app/(main)/components/DisclaimerModal.js
"use client";

import { useEffect } from 'react';

export default function DisclaimerModal({ isOpen, onClose }) {
    // --- MODIFIKASI: Gunakan class CSS untuk overflow ---
    useEffect(() => {
        if (isOpen) {
            // Tambahkan class saat modal terbuka
            document.body.classList.add('modal-open');
        } else {
            // Hapus class saat modal tertutup
            document.body.classList.remove('modal-open');
        }
        // Cleanup function: Hapus class saat komponen unmount
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]); // Hanya jalankan saat isOpen berubah
    // --- BATAS MODIFIKASI ---

    if (!isOpen) return null;

    const handleCloseAndSetFlag = () => {
        try {
            localStorage.setItem('hasSeenDisclaimer', 'true');
        } catch (error) {
            console.error("Failed to access localStorage:", error);
        }
        onClose(); // Tutup modal
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden border border-gray-300 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Biru */}
                <div className="flex justify-between items-center bg-[#0D2A57] text-white px-5 py-3">
                    <h2 className="text-lg font-semibold">Pemberitahuan Akses Data</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Area Konten */}
                <div className="p-6 md:p-8 space-y-3 text-sm text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto">
                    <p>Selamat datang di Insight Hub! Platform ini menyediakan akses ke berbagai data Kementerian Pekerjaan Umum (PU).</p>
                    <p><strong>Perlu diketahui:</strong> Tidak semua set data yang dikelola Kementerian PU tersedia secara publik di katalog ini. Ketersediaan data tunduk pada kebijakan internal dan peraturan yang berlaku.</p>
                    <p>Apabila data spesifik yang Anda butuhkan tidak ditemukan dalam katalog publik, Anda dapat mengajukan permintaan data secara resmi melalui menu <strong>"Pengajuan Data"</strong>. Tim kami akan meninjau permintaan Anda.</p>
                    <p>Dengan melanjutkan penggunaan platform ini, Anda memahami dan menyetujui pemberitahuan ini.</p>
                </div>

                {/* Footer Abu-abu */}
                <div className="bg-gray-100 px-5 py-3 flex justify-end border-t border-gray-200">
                    <button
                        onClick={handleCloseAndSetFlag}
                        className="px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}