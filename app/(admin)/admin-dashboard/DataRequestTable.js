"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UpdateRequestModal from "./UpdateRequestModal";

const FilterButton = ({ label, filterValue, activeFilter }) => {
    const href = filterValue === "all" ? "/requests" : `/requests?status=${filterValue}`;
    const isActive = activeFilter === filterValue;

    return (
        <Link href={href} scroll={false}>
            <motion.button
                whileTap={{ scale: 0.95 }}
                animate={{
                    backgroundColor: isActive ? "#2563eb" : "#e5e7eb",
                    color: isActive ? "#ffffff" : "#374151",
                }}
                transition={{ duration: 0.2 }}
                className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            >
                {label}
            </motion.button>
        </Link>
    );
};

// Komponen baris tabel
function RequestRow({ request, onReviewClick }) {
    const getStatusClass = (status) => {
        if (status === "pending") return "bg-yellow-100 text-yellow-800";
        if (status === "approved") return "bg-green-100 text-green-800";
        if (status === "rejected") return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{request.user_name}</div>
                <div className="text-sm text-gray-500">{request.user_email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {request.organization}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        request.status
                    )}`}
                >
                    {request.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.created_at).toLocaleDateString("id-ID")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onReviewClick(request)}
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    Tinjau
                </button>
            </td>
        </motion.tr>
    );
}

// Komponen utama
export default function DataRequestTable({ initialRequests }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filteredRequests, setFilteredRequests] = useState(initialRequests || []);

    const searchParams = useSearchParams();
    const activeFilter = searchParams.get("status") || "all";

    // Filter data setiap kali URL berubah
    useEffect(() => {
        const filtered =
            activeFilter === "all"
                ? initialRequests
                : initialRequests.filter((req) => req.status === activeFilter);
        setFilteredRequests(filtered);
    }, [activeFilter, initialRequests]);

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Manajemen Permohonan Data
                </h3>

                {/* Tombol filter */}
                <div className="flex space-x-2 mb-4 border-b pb-2">
                    <FilterButton label="Semua" filterValue="all" activeFilter={activeFilter} />
                    <FilterButton label="Pending" filterValue="pending" activeFilter={activeFilter} />
                    <FilterButton label="Approved" filterValue="approved" activeFilter={activeFilter} />
                    <FilterButton label="Rejected" filterValue="rejected" activeFilter={activeFilter} />
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pemohon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Instansi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <AnimatePresence>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((req) => (
                                        <RequestRow
                                            key={req.id}
                                            request={req}
                                            onReviewClick={setSelectedRequest}
                                        />
                                    ))
                                ) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td
                                            colSpan="5"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            Tidak ada data untuk filter ini.
                                        </td>
                                    </motion.tr>
                                )}
                            </tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </div>

            {selectedRequest && (
                <UpdateRequestModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </>
    );
}
