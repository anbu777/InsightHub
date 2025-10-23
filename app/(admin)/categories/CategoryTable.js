// app/(admin)/categories/CategoryTable.js
"use client";

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
// Impor action delete dari file actions.js di folder yang sama
import { deleteCategory } from './actions';

export default function CategoryTable({ categories }) {
  const [isPending, startTransition] = useTransition();

  // Fungsi handle hapus
  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Kategori "${name}"? Periksa apakah Kategori ini masih digunakan oleh katalog data.`)) {
      startTransition(async () => {
        const result = await deleteCategory(id); // Panggil Server Action
        if (result.success) {
          toast.success(result.message);
          // Refresh data (otomatis karena revalidatePath di action)
        } else {
          toast.error(result.message); // Tampilkan pesan error jika Kategori masih dipakai
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.nama_kategori}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* Link Edit */}
                    <Link href={`/categories/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                       <FaEdit />
                    </Link>
                    {/* Tombol Hapus */}
                    <button
                      onClick={() => handleDelete(category.id, category.nama_kategori)}
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
                  Belum ada Kategori yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}