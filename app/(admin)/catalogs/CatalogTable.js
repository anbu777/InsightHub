// app/(admin)/catalogs/CatalogTable.js
"use client"; // Komponen ini akan memiliki tombol interaktif (Edit/Hapus)

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Ikon untuk aksi
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { deleteCatalog } from './actions'; // Impor fungsi delete dari actions.js

export default function CatalogTable({ catalogs }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus katalog "${title}"?`)) {
      startTransition(async () => {
        const result = await deleteCatalog(id); // Panggil Server Action
        if (result.success) {
          toast.success(result.message);
          // Refresh data (akan otomatis jika revalidatePath bekerja di action)
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Katalog</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Organisasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {catalogs.length > 0 ? (
              catalogs.map((catalog) => (
                <tr key={catalog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{catalog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{catalog.nama_unor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{catalog.nama_kategori}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(catalog.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* Link ke halaman edit */}
                    <Link href={`/catalogs/${catalog.id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                       <FaEdit />
                    </Link>
                    {/* Tombol Hapus memanggil fungsi handleDelete */}
                    <button 
                      onClick={() => handleDelete(catalog.id, catalog.title)} 
                      disabled={isPending} // Disable saat proses hapus
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
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Belum ada katalog data yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}