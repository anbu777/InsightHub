// app/(admin)/categories/CategoryForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
// Impor actions create dan update dari file actions.js di folder yang sama
import { createCategory, updateCategory } from './actions';

export default function CategoryForm({ mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // State hanya untuk nama kategori
  const [namaKategori, setNamaKategori] = useState(initialData?.nama_kategori || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = namaKategori.trim(); // Trim spasi di awal/akhir
    if (!trimmedName) {
      toast.error("Nama Kategori tidak boleh kosong.");
      return;
    }

    startTransition(async () => {
      let result;
      try {
        if (mode === 'create') {
          console.log("Memanggil createCategory dengan nama:", trimmedName);
          result = await createCategory(trimmedName);
        } else {
          console.log(`Memanggil updateCategory (ID: ${initialData.id}) dengan nama:`, trimmedName);
          result = await updateCategory(initialData.id, trimmedName);
        }

        console.log("Hasil Server Action:", result);
        if (result.success) {
          toast.success(result.message);
          router.push('/categories'); // Kembali ke daftar setelah sukses
          router.refresh(); // Memicu refresh data
        } else {
          toast.error(result.message || 'Terjadi kesalahan.');
        }
      } catch (error) {
        console.error("Error submitting Category form:", error);
        toast.error('Terjadi kesalahan tidak terduga.');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="nama_kategori"
            name="nama_kategori"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link href="/categories" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isPending ? 'Menyimpan...' : (mode === 'create' ? 'Simpan Kategori Baru' : 'Simpan Perubahan')}
          </button>
        </div>
      </form>
    </div>
  );
}