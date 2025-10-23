// app/(admin)/admin-dashboard/FeedbackTable.js
"use client"; // Tambahkan ini karena kita butuh state & interaksi

import { useTransition } from 'react'; // Impor useTransition
import toast from 'react-hot-toast'; // Impor toast
import { FaTrash } from 'react-icons/fa'; // Impor ikon
// Impor action delete feedback
import { deleteFeedback } from './actions';

// Fungsi helper emoji (tetap sama)
const getEmojiForRating = (rating) => {
    const emojis = ['😡', '☹️', '😐', '🙂', '😄'];
    if (rating >= 0 && rating < emojis.length) {
        return emojis[rating];
    }
    return '❓';
};

export default function FeedbackTable({ initialFeedback }) {
    // State pending untuk proses hapus
    const [isPending, startTransition] = useTransition();

    // === FUNGSI BARU: Handle Hapus Feedback ===
    const handleDelete = (id, name) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus feedback dari "${name}"?`)) {
            startTransition(async () => {
                const result = await deleteFeedback(id); // Panggil action delete
                if (result.success) {
                    toast.success(result.message);
                    // Refresh otomatis karena revalidatePath di action
                } else {
                    toast.error(result.message);
                }
            });
        }
    };
    // === AKHIR FUNGSI BARU ===

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Kritik & Saran Pengguna</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saran / Feedback</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            {/* === KOLOM BARU === */}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {initialFeedback.length > 0 ? (
                            initialFeedback.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.user_name}</div>
                                        <div className="text-sm text-gray-500">{item.gender}, {item.age_range}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-sm">{item.suggestion || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-2xl">
                                         {getEmojiForRating(item.rating)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                     {/* === TOMBOL HAPUS BARU === */}
                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(item.id, item.user_name)}
                                            disabled={isPending}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                                            title="Hapus Feedback"
                                        >
                                            <FaTrash />
                                        </button>
                                     </td>
                                </tr>
                            ))
                        ) : (
                             <tr><td colSpan="5" className="text-center py-4 text-gray-500">Belum ada feedback yang masuk.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}