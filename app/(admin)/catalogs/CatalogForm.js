// app/(admin)/catalogs/CatalogForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { createCatalog, updateCatalog } from './actions';

export default function CatalogForm({ unors, categories, mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    unor_id: initialData?.unor_id || '',
    category_id: initialData?.category_id || '',
    data_url: initialData?.data_url || '',
    sample_data: initialData?.sample_data ? JSON.stringify(initialData.sample_data, null, 2) : '',
    metadata: initialData?.metadata ? JSON.stringify(initialData.metadata, null, 2) : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const parseJsonField = (fieldName) => {
    const value = formData[fieldName].trim();
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
       toast.error(`Format JSON tidak valid untuk field ${fieldName}. Periksa tanda kurung, koma, dan kutip.`);
       return 'INVALID_JSON';
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSampleData = parseJsonField('sample_data');
    const finalMetadata = parseJsonField('metadata');
    if (finalSampleData === 'INVALID_JSON' || finalMetadata === 'INVALID_JSON') {
       console.error("Submit dibatalkan karena JSON tidak valid.");
       return;
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      unor_id: formData.unor_id,
      category_id: formData.category_id,
      data_url: formData.data_url,
      sample_data: finalSampleData,
      metadata: finalMetadata,
    };
    startTransition(async () => {
      let result;
      try {
        if (mode === 'create') {
          result = await createCatalog(payload);
        } else {
          result = await updateCatalog(initialData.id, payload);
        }
        if (result.success) {
          toast.success(result.message);
          router.push('/catalogs');
          router.refresh();
        } else {
          toast.error(result.message || 'Terjadi kesalahan.');
        }
      } catch (error) {
          console.error("Error selama transisi submit:", error);
          toast.error('Terjadi kesalahan tidak terduga saat menyimpan data.');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Katalog <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            // === TAMBAHKAN text-gray-900 ===
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Textarea Description */}
         <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
             // === TAMBAHKAN text-gray-900 ===
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Select UNOR & Kategori */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label htmlFor="unor_id" className="block text-sm font-medium text-gray-700 mb-1">Unit Organisasi <span className="text-red-500">*</span></label>
             <select
               id="unor_id"
               name="unor_id"
               value={formData.unor_id}
               onChange={handleChange}
               required
                // === TAMBAHKAN text-gray-900 ===
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
             >
               <option value="" className="text-gray-500">Pilih UNOR...</option>
               {unors.map(unor => (
                 <option key={unor.id} value={unor.id}>{unor.nama_unor}</option>
               ))}
             </select>
           </div>

           <div>
             <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
             <select
               id="category_id"
               name="category_id"
               value={formData.category_id}
               onChange={handleChange}
               required
               // === TAMBAHKAN text-gray-900 ===
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
             >
               <option value="" className="text-gray-500">Pilih Kategori...</option>
               {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
               ))}
             </select>
           </div>
         </div>

         {/* Input Data URL */}
         <div>
          <label htmlFor="data_url" className="block text-sm font-medium text-gray-700 mb-1">URL API Data <span className="text-red-500">*</span></label>
          <input
            type="url"
            id="data_url"
            name="data_url"
            placeholder="https://...supabase.co/rest/v1/nama_tabel_data?select=*"
            value={formData.data_url}
            onChange={handleChange}
            required
            // === TAMBAHKAN text-gray-900 ===
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <p className="mt-1 text-xs text-gray-500">URL ini didapat setelah mengimpor file CSV/data ke Supabase sebagai tabel baru.</p>
        </div>

        {/* Textarea Sample Data (JSON) */}
         <div>
          <label htmlFor="sample_data" className="block text-sm font-medium text-gray-700 mb-1">Sample Data (Format JSON)</label>
          <textarea
            id="sample_data"
            name="sample_data"
            rows="5"
            placeholder={`[
  { "kolom1": "nilai1", "kolom2": 123 },
  { "kolom1": "nilai2", "kolom2": 456 }
]`}
            value={formData.sample_data}
            onChange={handleChange}
            // === TAMBAHKAN text-gray-900 ===
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
          />
           <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ada. Pastikan format JSON valid.</p>
        </div>

        {/* Textarea Metadata (JSON) */}
         <div>
          <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 mb-1">Metadata (Format JSON)</label>
          <textarea
            id="metadata"
            name="metadata"
            rows="5"
             placeholder={`{
  "deskripsi_kolom": [
    { "nama": "kolom1", "deskripsi": "Penjelasan kolom 1" }
  ]
}`}
            value={formData.metadata}
            onChange={handleChange}
            // === TAMBAHKAN text-gray-900 ===
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
          />
           <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ada. Pastikan format JSON valid.</p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
           <Link href="/catalogs" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
             Batal
           </Link>
           <button
             type="submit"
             disabled={isPending}
             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
           >
             {isPending ? 'Menyimpan...' : (mode === 'create' ? 'Simpan Katalog Baru' : 'Simpan Perubahan')}
           </button>
        </div>
      </form>
    </div>
  );
}