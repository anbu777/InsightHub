"use client";

import { useState, useEffect } from 'react';

export default function FeedbackTable() {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/admin/feedback');
                if (!res.ok) throw new Error('Gagal mengambil data feedback.');
                const data = await res.json();
                setFeedback(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Kritik & Saran Pengguna</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saran / Feedback</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                        ) : feedback.length > 0 ? (
                            feedback.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">{item.gender}, {item.age_range}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-sm">{item.suggestion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>Pendapat: {item.opinion_rating}/5</div>
                                        <div>Teknis: {item.technical_rating}/5</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-4 text-gray-500">Belum ada feedback yang masuk.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}