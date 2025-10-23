// app/(admin)/unors/UnorForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
// Impor actions (akan dibuat selanjutnya)
import { createUnor, updateUnor } from './actions';

export default function UnorForm({ mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [namaUnor, setNamaUnor] = useState(initialData?.nama_unor || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaUnor.trim()) {
      toast.error("Nama UNOR tidak boleh kosong.");
      return;
    }

    startTransition(async () => {
      let result;
      try {
        if (mode === 'create') {
          result = await createUnor(namaUnor);
        } else {
          result = await updateUnor(initialData.id, namaUnor);
        }

        if (result.success) {
          toast.success(result.message);
          router.push('/unors'); // Kembali ke daftar setelah sukses
          router.refresh();
        } else {
          toast.error(result.message || 'Terjadi kesalahan.');
        }
      } catch (error) {
        console.error("Error submitting UNOR form:", error);
        toast.error('Terjadi kesalahan tidak terduga.');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama_unor" className="block text-sm font-medium text-gray-700 mb-1">Nama Unit Organisasi <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="nama_unor"
            name="nama_unor"
            value={namaUnor}
            onChange={(e) => setNamaUnor(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link href="/unors" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isPending ? 'Menyimpan...' : (mode === 'create' ? 'Simpan UNOR Baru' : 'Simpan Perubahan')}
          </button>
        </div>
      </form>
    </div>
  );
}