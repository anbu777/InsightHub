// app/(admin)/admin-dashboard/FeedbackTable.js

// Komponen ini bisa menjadi Server Component atau Client Component
// karena tidak memiliki state atau interaktivitas.
// Kita biarkan sederhana tanpa "use client"
export default function FeedbackTable({ initialFeedback }) {
    
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
                        {initialFeedback.length > 0 ? (
                            initialFeedback.map(item => (
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