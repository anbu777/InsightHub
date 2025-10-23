// app/(admin)/admin-dashboard/UpdateRequestModal.js
"use client";

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
// Impor KEDUA actions: update dan delete
import { updateRequestStatus, deleteRequest } from './actions';
import { FaTrash } from 'react-icons/fa'; // Impor ikon

export default function UpdateRequestModal({ request, onClose }) {
    const [status, setStatus] = useState(request.status);
    const [responseLink, setResponseLink] = useState(request.response_link || '');

    // Pisahkan state pending untuk update dan delete
    const [isUpdating, startUpdateTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();

    // Fungsi handle simpan (tetap sama)
    const handleSubmit = (e) => {
        e.preventDefault();
        startUpdateTransition(async () => {
            const formData = new FormData();
            formData.append('id', request.id);
            formData.append('status', status);
            formData.append('response_link', responseLink);
            const result = await updateRequestStatus(formData);
            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message);
            }
        });
    };

    // === FUNGSI BARU: Handle Hapus ===
    const handleDelete = () => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus permintaan dari "${request.user_name}"?`)) {
            startDeleteTransition(async () => {
                const result = await deleteRequest(request.id); // Panggil action delete
                if (result.success) {
                    toast.success(result.message);
                    onClose(); // Tutup modal setelah berhasil hapus
                } else {
                    toast.error(result.message);
                }
            });
        }
    };
    // === AKHIR FUNGSI BARU ===

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Tinjau Permohonan Data</h2>
                     {/* === TOMBOL HAPUS BARU === */}
                     <button
                        onClick={handleDelete}
                        disabled={isDeleting || isUpdating}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Hapus Permintaan"
                    >
                        <FaTrash size={18} />
                    </button>
                     {/* === AKHIR TOMBOL HAPUS === */}
                </div>

                <div className="mb-4 border-b pb-4 text-gray-800 space-y-1">
                    <p><strong>Nama:</strong> {request.user_name}</p>
                    <p><strong>Email:</strong> {request.user_email}</p>
                    <p><strong>Telepon:</strong> {request.user_phone || '-'}</p>
                    <p><strong>Instansi:</strong> {request.organization}</p>
                    <p><strong>Data yang Diminta:</strong> {request.reason}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ... (Input Status dan Link Balasan tetap sama) ... */}
                     <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-1">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="responseLink" className="block text-sm font-medium text-gray-800 mb-1">Link Balasan (Opsional)</label>
                        <input
                            id="responseLink"
                            name="response_link"
                            type="text"
                            placeholder="https://link-ke-data-atau-balasan.com"
                            value={responseLink}
                            onChange={(e) => setResponseLink(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" disabled={isUpdating || isDeleting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}