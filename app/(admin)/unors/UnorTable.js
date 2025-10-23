// app/(admin)/unors/UnorTable.js
"use client";

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
// BARU: Impor action delete
import { deleteUnor } from './actions';

export default function UnorTable({ unors }) {
  const [isPending, startTransition] = useTransition();

  // Fungsi handle hapus (Sekarang AKTIF)
  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus UNOR "${name}"? Periksa apakah UNOR ini masih digunakan oleh katalog data.`)) {
      startTransition(async () => {
        const result = await deleteUnor(id); // Panggil Server Action
        if (result.success) {
          toast.success(result.message);
          // Refresh otomatis karena revalidatePath di action
        } else {
          toast.error(result.message); // Tampilkan pesan error jika UNOR masih dipakai
        }
      });
    }
  };

  // ... (sisa kode komponen tetap sama) ...
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Unit Organisasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unors.length > 0 ? (
              unors.map((unor) => (
                <tr key={unor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{unor.nama_unor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(unor.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* Link Edit */}
                    <Link href={`/unors/${unor.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                       <FaEdit />
                    </Link>
                    {/* Tombol Hapus */}
                    <button
                      onClick={() => handleDelete(unor.id, unor.nama_unor)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                      title="Hapus"
                    >
                       <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  Belum ada Unit Organisasi yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}