// app/(main)/components/DisclaimerModal.js
"use client";

import { useEffect } from 'react';

export default function DisclaimerModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Fungsi ini sekarang akan dipanggil oleh tombol "Tutup"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
            // onClick={onClose} // Optional: biarkan klik luar menutup atau tidak
        >
            {/* --- MODIFIKASI: Wrapper utama modal --- */}
            <div
                className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden border border-gray-300 transform transition-all duration-300 scale-100" // Hapus padding, tambah overflow-hidden & border
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- MODIFIKASI: Header Biru --- */}
                <div className="flex justify-between items-center bg-[#0D2A57] text-white px-5 py-3"> {/* Warna header, padding */}
                    <h2 className="text-lg font-semibold">Pemberitahuan Akses Data</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {/* --- BATAS MODIFIKASI HEADER --- */}

                {/* --- MODIFIKASI: Area Konten dengan Padding --- */}
                <div className="p-6 md:p-8 space-y-3 text-sm text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto"> {/* Tambah padding di sini, max-height & scroll */}
                    <p>Selamat datang di Insight Hub! Platform ini menyediakan akses ke berbagai data Kementerian Pekerjaan Umum (PU).</p>
                    <p><strong>Perlu diketahui:</strong> Tidak semua set data yang dikelola Kementerian PU tersedia secara publik di katalog ini. Ketersediaan data tunduk pada kebijakan internal dan peraturan yang berlaku.</p>
                    <p>Apabila data spesifik yang Anda butuhkan tidak ditemukan dalam katalog publik, Anda dapat mengajukan permintaan data secara resmi melalui menu <strong>"Pengajuan Data"</strong>. Tim kami akan meninjau permintaan Anda.</p>
                    <p>Dengan melanjutkan penggunaan platform ini, Anda memahami dan menyetujui pemberitahuan ini.</p>
                </div>
                {/* --- BATAS MODIFIKASI KONTEN --- */}

                {/* --- MODIFIKASI: Footer Abu-abu dengan Satu Tombol --- */}
                <div className="bg-gray-100 px-5 py-3 flex justify-end border-t border-gray-200"> {/* Warna footer, padding, border */}
                    <button
                        onClick={handleCloseAndSetFlag} // Panggil fungsi yang menyimpan flag
                        className="px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
                {/* --- BATAS MODIFIKASI FOOTER --- */}
            </div>
        </div>
    );
}