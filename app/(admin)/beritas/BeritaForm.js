// app/(admin)/beritas/BeritaForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image'; // Impor Image untuk preview
import { createBerita, updateBerita } from './actions';

export default function BeritaForm({ mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // State untuk data teks
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    source_url: initialData?.source_url || '',
    content: initialData?.content || '',
  });
  
  // State terpisah untuk file gambar
  const [imageFile, setImageFile] = useState(null);
  // State untuk preview gambar
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler baru untuk input file gambar
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file); // Simpan file di state
      
      // Buat URL preview di sisi client
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler Submit Form (sekarang menggunakan FormData)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Judul, Kutipan, dan Konten wajib diisi.');
      return;
    }
    
    // Validasi file di mode 'create'
    if (mode === 'create' && !imageFile) {
        toast.error('File gambar wajib diisi untuk berita baru.');
        return;
    }

    startTransition(async () => {
      // Buat FormData untuk dikirim ke Server Action
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('source_url', formData.source_url);
      data.append('content', formData.content);
      
      if (imageFile) {
        // Hanya tambahkan file jika ada file baru yang dipilih
        data.append('image_file', imageFile); 
      }
      
      // Jika mode edit, kita perlu ID dan URL gambar lama (untuk dihapus jika diganti)
      if (mode === 'edit') {
          data.append('id', initialData.id);
          data.append('old_image_url', initialData.image_url || '');
      }

      let result;
      try {
        if (mode === 'create') {
          result = await createBerita(data); // Kirim FormData
        } else {
          result = await updateBerita(data); // Kirim FormData
        }

        if (result.success) {
          toast.success(result.message);
          router.push('/beritas'); // Kembali ke daftar
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
      {/* Ubah form agar bisa menangani file upload */}
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

        {/* === INPUT GAMBAR BARU === */}
        <div>
          <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Utama {mode === 'create' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            id="image_file"
            name="image_file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            required={mode === 'create'} // Wajib di mode create
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {mode === 'edit' && <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah gambar utama.</p>}
          
          {/* Tampilkan Preview Gambar */}
          {imagePreview && (
            <div className="mt-4 relative w-48 h-32 rounded-lg overflow-hidden border">
                <Image src={imagePreview} alt="Preview Gambar" layout="fill" objectFit="cover" />
            </div>
          )}
        </div>
        {/* === AKHIR INPUT GAMBAR === */}

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
          <Link href="/beritas" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Batal
          </Link>
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