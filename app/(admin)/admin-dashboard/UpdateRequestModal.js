"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdateRequestModal({ request, onClose, onUpdate }) {
    // State untuk menyimpan perubahan pada form di dalam modal
    const [status, setStatus] = useState(request.status);
    const [responseLink, setResponseLink] = useState(request.response_link || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Memperbarui permohonan...');

        try {
            const res = await fetch(`/api/admin/requests/${request.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: status,
                    response_link: responseLink
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal memperbarui data.');
            }

            toast.success('Permohonan berhasil diperbarui!', { id: toastId });
            onUpdate(); // Memberi tahu komponen induk untuk memuat ulang data
            onClose(); // Menutup modal

        } catch (err) {
            toast.error(err.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Latar belakang gelap (overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            {/* Konten Modal */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tinjau Permohonan Data</h2>
                
                {/* --- PERUBAHAN WARNA 1: Info Pemohon --- */}
                <div className="mb-4 border-b pb-4 text-gray-800 space-y-1">
                    <p><strong>Nama:</strong> {request.name}</p>
                    <p><strong>Email:</strong> {request.email}</p>
                    <p><strong>Instansi:</strong> {request.agency}</p>
                    <p><strong>Data yang Diminta:</strong> {request.requested_data}</p>
                </div>

                {/* Form untuk Update */}
                <form onSubmit={handleSubmit}>
                    {/* Input Status */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-1">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            // --- PERUBAHAN WARNA 2: Teks di dalam Select Box ---
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="pending">pending</option>
                            <option value="in progress">in progress</option>
                            <option value="done">done</option>
                        </select>
                    </div>

                    {/* Input Link Balasan */}
                    <div className="mb-6">
                        <label htmlFor="responseLink" className="block text-sm font-medium text-gray-800 mb-1">Link Balasan</label>
                        <input
                            id="responseLink"
                            type="text"
                            placeholder="https://link-ke-data.json"
                            value={responseLink}
                            onChange={(e) => setResponseLink(e.target.value)}
                            // --- PERUBAHAN WARNA 3: Teks di dalam Input Box ---
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>
                    
                    {/* Tombol Aksi (Tidak Diubah) */}
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}