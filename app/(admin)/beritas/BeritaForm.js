// app/(admin)/beritas/BeritaForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { createBerita, updateBerita } from './actions';

export default function BeritaForm({ mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    image_url: initialData?.image_url || '',
    source_url: initialData?.source_url || '',
    content: initialData?.content || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Judul, Kutipan, dan Konten wajib diisi.');
      return;
    }

    startTransition(async () => {
      let result;
      const payload = { ...formData };

      try {
        if (mode === 'create') {
          result = await createBerita(payload);
        } else {
          result = await updateBerita(initialData.id, payload);
        }

        if (result.success) {
          toast.success(result.message);
          // === PERBAIKAN DI SINI ===
          router.push('/beritas'); // Arahkan kembali ke /beritas (plural)
          // === AKHIR PERBAIKAN ===
          router.refresh();
        } else {
          toast.error(result.message || 'Terjadi kesalahan.');
        }
      } catch (error) {
        console.error("Error submitting Berita form:", error);
        toast.error('Terjadi kesalahan tidak terduga.');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Berita <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (dari Supabase Storage) <span className="text-red-500">*</span></label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
            placeholder="https://...supabase.co/storage/v1/object/public/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
           <p className="mt-1 text-xs text-gray-500">Anda harus meng-upload gambar ke Supabase Storage terlebih dahulu dan salin URL publiknya ke sini.</p>
        </div>

         <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Kutipan (Excerpt) <span className="text-red-500">*</span></label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Ringkasan singkat berita yang akan tampil di halaman utama."
          />
        </div>

         <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Konten Lengkap <span className="text-red-500">*</span></label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Tulis konten lengkap berita di sini. Pisahkan paragraf dengan baris baru."
          />
        </div>

         <div>
          <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 mb-1">URL Sumber (Misal: Instagram)</label>
          <input
            type="url"
            id="source_url"
            name="source_url"
            value={formData.source_url}
            onChange={handleChange}
            placeholder="https://www.instagram.com/p/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          {/* === PERBAIKAN DI SINI === */}
          <Link href="/beritas" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Batal
          </Link>
          {/* === AKHIR PERBAIKAN === */}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isPending ? 'Menyimpan...' : (mode === 'create' ? 'Publikasikan Berita' : 'Simpan Perubahan')}
          </button>
        </div>
      </form>
    </div>
  );
}