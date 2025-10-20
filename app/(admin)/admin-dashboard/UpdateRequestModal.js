// app/(admin)/admin-dashboard/UpdateRequestModal.js

"use client";

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { updateRequestStatus } from './actions'; // Impor Server Action

export default function UpdateRequestModal({ request, onClose }) {
    const [status, setStatus] = useState(request.status);
    const [responseLink, setResponseLink] = useState(request.response_link || '');
    
    // useTransition untuk menangani loading state tanpa memblokir UI
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', request.id);
            formData.append('status', status);
            formData.append('response_link', responseLink);

            const result = await updateRequestStatus(formData);

            if (result.success) {
                toast.success(result.message);
                onClose(); // Tutup modal setelah berhasil
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tinjau Permohonan Data</h2>
                
                <div className="mb-4 border-b pb-4 text-gray-800 space-y-1">
                    <p><strong>Nama:</strong> {request.name}</p>
                    <p><strong>Email:</strong> {request.email}</p>
                    <p><strong>Instansi:</strong> {request.agency}</p>
                    <p><strong>Data yang Diminta:</strong> {request.requested_data}</p>
                </div>

                <form onSubmit={handleSubmit}>
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
                            <option value="in progress">in progress</option>
                            <option value="done">done</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="responseLink" className="block text-sm font-medium text-gray-800 mb-1">Link Balasan</label>
                        <input
                            id="responseLink"
                            name="response_link"
                            type="text"
                            placeholder="https://link-ke-data.json"
                            value={responseLink}
                            onChange={(e) => setResponseLink(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}