// app/(admin)/beritas/BeritaTable.js
"use client";

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { deleteBerita } from './actions';

export default function BeritaTable({ beritaItems }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
      startTransition(async () => {
        const result = await deleteBerita(id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Berita</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kutipan (Excerpt)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {beritaItems.length > 0 ? (
              beritaItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-sm text-gray-700 max-w-md truncate">{item.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* === PERBAIKAN DI SINI === */}
                    <Link href={`/beritas/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                       <FaEdit />
                    </Link>
                    {/* === AKHIR PERBAIKAN === */}
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
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
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  Belum ada berita yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}