// app/(admin)/catalogs/CatalogForm.js
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
// Impor SEMUA action
import { createCatalog, updateCatalog, inspectApiEndpoint, createCatalogFromCSV } from './actions';

export default function CatalogForm({ unors, categories, mode = 'create', initialData = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inspectUrl, setInspectUrl] = useState('');
  const [isInspecting, startInspectTransition] = useTransition();
  const [file, setFile] = useState(null);
  // 'manual' (termasuk inspeksi) atau 'upload'
  const [inputType, setInputType] = useState('manual'); 

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
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (mode === 'create' && !formData.title && selectedFile) {
        const cleanName = selectedFile.name
          .replace(/\.csv$/i, '')
          .replace(/[_-]/g, ' ') 
          .replace(/\b\w/g, l => l.toUpperCase());
        setFormData(prev => ({ ...prev, title: cleanName }));
      }
    } else {
      setFile(null);
    }
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

  // === handleSubmit DI-REFAKTOR agar lebih jelas ===
  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      let result;
      try {
        if (mode === 'create') {
          // --- Alur 1: Upload CSV ---
          if (inputType === 'upload') { 
            if (!file) {
              toast.error('File CSV wajib diisi untuk mode Upload CSV.');
              return; // Hentikan transisi
            }
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('unor_id', formData.unor_id);
            data.append('category_id', formData.category_id);
            data.append('csv_file', file);
            
            console.log("Mengirim data (createCatalogFromCSV)...");
            result = await createCatalogFromCSV(data);

          } else { 
            // --- Alur 2: Manual / Inspeksi ---
            const finalSampleData = parseJsonField('sample_data');
            const finalMetadata = parseJsonField('metadata');
            if (finalSampleData === 'INVALID_JSON' || finalMetadata === 'INVALID_JSON') return;
            
            const payload = {
              title: formData.title,
              description: formData.description,
              unor_id: formData.unor_id,
              category_id: formData.category_id,
              data_url: formData.data_url,
              sample_data: finalSampleData,
              metadata: finalMetadata,
            };
            // Panggil action create manual yang lama
            console.log("Mengirim data (createCatalog)...");
            result = await createCatalog(payload); 
          }
        
        } else {
          // --- Alur 3: Edit (Tetap sama) ---
          const finalSampleData = parseJsonField('sample_data');
          const finalMetadata = parseJsonField('metadata');
          if (finalSampleData === 'INVALID_JSON' || finalMetadata === 'INVALID_JSON') return;

          const payload = {
            title: formData.title,
            description: formData.description,
            unor_id: formData.unor_id,
            category_id: formData.category_id,
            data_url: formData.data_url,
            sample_data: finalSampleData,
            metadata: finalMetadata,
          };
          console.log(`Mengirim data (updateCatalog ID: ${initialData.id})...`);
          result = await updateCatalog(initialData.id, payload);
        }

        // Handle hasil (Pastikan 'result' tidak undefined)
        if (result && result.success) {
          toast.success(result.message);
          router.push('/catalogs');
          router.refresh();
        } else {
          // Tampilkan pesan error dari result jika ada, jika tidak, tampilkan pesan umum
          toast.error(result?.message || 'Terjadi kesalahan yang tidak diketahui.');
        }
      } catch (error) {
          console.error("Error selama transisi submit:", error);
          toast.error(`Terjadi kesalahan: ${error.message}`);
      }
    });
  };

  const handleInspect = () => {
    if (!inspectUrl.trim()) {
        toast.error('Silakan masukkan URL API yang ingin diinspeksi.');
        return;
    }
    startInspectTransition(async () => {
        try {
            console.log(`Memulai inspeksi untuk: ${inspectUrl}`);
            const result = await inspectApiEndpoint(inspectUrl);
            if (result && result.success) { // Tambahkan pengecekan result
                toast.success(result.message);
                setFormData(prev => ({
                    ...prev,
                    data_url: result.data.data_url,
                    sample_data: result.data.sample_data_string,
                    metadata: result.data.metadata_string,
                    title: prev.title || inspectUrl.split('/').pop().split('?')[0] || ''
                }));
                setInputType('manual'); 
                toast.success('Field URL, Sample, dan Metadata telah diisi. Silakan lengkapi sisa form.');
            } else {
                toast.error(result?.message || 'Gagal menginspeksi API.');
            }
        } catch (error) {
            console.error("Error selama transisi inspeksi:", error);
            toast.error('Terjadi kesalahan tidak terduga saat inspeksi.');
        }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">

      {mode === 'create' && (
        <div className="space-y-4 mb-8 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700">Asisten Pembuat Katalog</h3>
            <div className="flex flex-col md:flex-row gap-4"> {/* Dibuat responsif */}
                <button 
                    type="button"
                    onClick={() => setInputType('upload')}
                    className={`flex-1 p-4 border-2 rounded-lg text-center ${inputType === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                    <div className="text-xl">🚀</div>
                    <div className="font-semibold text-gray-800">Opsi 1: Upload CSV</div>
                    <p className="text-sm text-gray-600">Otomatis buat tabel & API dari file CSV.</p>
                </button>
                <button 
                    type="button"
                    onClick={() => setInputType('manual')}
                    className={`flex-1 p-4 border-2 rounded-lg text-center ${inputType === 'manual' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                    <div className="text-xl">✍️</div>
                    <div className="font-semibold text-gray-800">Opsi 2: Manual / Inspeksi URL</div>
                    <p className="text-sm text-gray-600">Isi semua field secara manual (atau gunakan 'Inspeksi').</p>
                </button>
            </div>
            
            {inputType === 'manual' && (
                <div className="pt-4 border-t">
                    <label htmlFor="inspect_url" className="block text-sm font-medium text-gray-700 mb-1">Asisten Inspeksi URL</label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                            type="url"
                            id="inspect_url"
                            name="inspect_url"
                            value={inspectUrl}
                            onChange={(e) => setInspectUrl(e.target.value)}
                            placeholder="Tempel URL API random di sini..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        />
                        <button
                            type="button"
                            onClick={handleInspect}
                            disabled={isInspecting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {isInspecting ? '...' : 'Inspeksi'}
                        </button>
                    </div>
                     <p className="mt-1 text-xs text-gray-500">Gunakan ini untuk mengisi otomatis field URL, Sample, dan Metadata di bawah.</p>
                </div>
            )}

            {inputType === 'upload' && (
                 <div className="pt-4 border-t">
                     <label htmlFor="csv_file" className="block text-sm font-medium text-gray-700 mb-1">Upload File CSV <span className="text-red-500">*</span></label>
                     <input 
                       type="file" 
                       id="csv_file" 
                       name="csv_file" 
                       onChange={handleFileChange}
                       // Hapus 'required' di sini, kita validasi di handleSubmit
                       // required={mode === 'create' && inputType === 'upload'} 
                       accept=".csv"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                     />
                     <p className="mt-1 text-xs text-gray-500">File ini akan diunggah untuk membuat tabel dan API baru secara otomatis.</p>
                </div>
            )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Katalog <span className="text-red-500">*</span></label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label htmlFor="unor_id" className="block text-sm font-medium text-gray-700 mb-1">Unit Organisasi <span className="text-red-500">*</span></label>
             <select
               id="unor_id"
               name="unor_id"
               value={formData.unor_id}
               onChange={handleChange}
               required
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
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
             >
               <option value="" className="text-gray-500">Pilih Kategori...</option>
               {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
               ))}
             </select>
           </div>
         </div>

         {/* Tampilkan field manual HANYA jika mode 'edit' ATAU (mode 'create' DAN tipe 'manual') */}
        {(mode === 'edit' || (mode === 'create' && inputType === 'manual')) && (
          <>
            <div className="pt-4 border-t">
              <label htmlFor="data_url" className="block text-sm font-medium text-gray-700 mb-1">URL API Data <span className="text-red-500">*</span></label>
              <input
                type="url"
                id="data_url"
                name="data_url"
                placeholder="https://...supabase.co/rest/v1/nama_tabel_data?select=*"
                value={formData.data_url}
                onChange={handleChange}
                required={mode === 'edit' || (mode === 'create' && inputType === 'manual')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500">Diisi manual atau otomatis oleh 'Inspeksi API'.</p>
            </div>
            <div>
              <label htmlFor="sample_data" className="block text-sm font-medium text-gray-700 mb-1">Sample Data (Format JSON)</label>
              <textarea
                id="sample_data"
                name="sample_data"
                rows="5"
                placeholder={`[ { "kolom1": "nilai1" } ]`}
                value={formData.sample_data}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
              />
               <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ada. Pastikan format JSON valid.</p>
            </div>
            <div>
              <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 mb-1">Metadata (Format JSON)</label>
              <textarea
                id="metadata"
                name="metadata"
                rows="5"
                placeholder={`{ "deskripsi_kolom": [ ... ] }`}
                value={formData.metadata}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
              />
               <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ada. Pastikan format JSON valid.</p>
            </div>
          </>
        )}
        
        {/* Tampilkan helper text jika mode 'create' dan 'upload' */}
        {mode === 'create' && inputType === 'upload' && (
             <p className="text-sm text-gray-500 text-center italic">Kolom URL API, Sample Data, dan Metadata akan di-generate otomatis oleh sistem dari file CSV.</p>
        )}


        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
           <Link href="/catalogs" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
             Batal
           </Link>
  _        <button
             type="submit"
             disabled={isPending || isInspecting} // Disable saat inspeksi atau submit
             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
           >
             {isPending ? 'Memproses...' : (mode === 'create' ? 'Simpan Katalog Baru' : 'Simpan Perubahan')}
           </button>
        </div>
      </form>
    </div>
  );
}