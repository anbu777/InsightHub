-- SEED DATA UNTUK INSIGHT HUB
-- Jalankan ini untuk mengisi data awal pada database lokal/baru.

-- 1. Seed Data UNOR (Unit Organisasi)
INSERT INTO public.unors (nama_unor)
VALUES
  ('Sekretariat Jenderal'),
  ('Direktorat Jenderal Sumber Daya Air'),
  ('Direktorat Jenderal Bina Marga'),
  ('Direktorat Jenderal Cipta Karya'),
  ('Direktorat Jenderal Perumahan'),
  ('Direktorat Jenderal Bina Konstruksi'),
  ('Direktorat Jenderal Pembiayaan Infrastruktur'),
  ('Inspektorat Jenderal'),
  ('Badan Pengembangan Infrastruktur Wilayah'),
  ('Badan Pengembangan Sumber Daya Manusia')
ON CONFLICT (nama_unor) DO NOTHING; 

-- 2. Seed Data Kategori
INSERT INTO public.categories (nama_kategori)
VALUES
  ('Infrastruktur Jalan & Jembatan'),
  ('Sumber Daya Air'),
  ('Permukiman & Perumahan'),
  ('Keuangan & Anggaran'),
  ('Sumber Daya Manusia'),
  ('Regulasi & Kebijakan'),
  ('Aset & Barang Milik Negara')
ON CONFLICT (nama_kategori) DO NOTHING;

-- 3. Seed Data Katalog (Dummy)
INSERT INTO public.datasets (title, description, data_url, sample_data, metadata, click_count, unor_id, category_id)
VALUES
  (
    'Data Bendung Wilayah Sungai Citarum',
    'Dataset ini berisi informasi mengenai bendung-bendung yang berada di wilayah sungai Citarum, mencakup lokasi, dimensi teknis, dan status pemeliharaan.',
    'https://example.com/api/bendung', 
    '[
      {"nama_infrastruktur": "Bendung Curug", "kota_kabupaten": "Karawang", "kondisi_bangunan": "Baik"},
      {"nama_infrastruktur": "Bendung Walahar", "kota_kabupaten": "Karawang", "kondisi_bangunan": "Sedang"}
    ]'::jsonb,
    '{"sumber": "Ditjen SDA", "tahun_data": 2023, "total_baris": 150}'::jsonb,
    120,
    (SELECT id FROM public.unors WHERE nama_unor = 'Direktorat Jenderal Sumber Daya Air' LIMIT 1),
    (SELECT id FROM public.categories WHERE nama_kategori = 'Sumber Daya Air' LIMIT 1)
  ),
  (
    'Aset Tanah PU - DKI Jakarta',
    'Daftar aset tanah milik Kementerian PU yang berlokasi di DKI Jakarta, termasuk luas, status sertifikat, dan penggunaan.',
    'https://example.com/api/aset-tanah',
    '[
      {"nama_barang": "Tanah Kantor", "alamat": "Jl. Pattimura No. 20", "luas": 5000},
      {"nama_barang": "Tanah Rumah Dinas", "alamat": "Kebayoran Baru", "luas": 200}
    ]'::jsonb,
    '{"sumber": "Sekjen", "tahun_data": 2024}'::jsonb,
    45,
    (SELECT id FROM public.unors WHERE nama_unor = 'Sekretariat Jenderal' LIMIT 1),
    (SELECT id FROM public.categories WHERE nama_kategori = 'Aset & Barang Milik Negara' LIMIT 1)
  );

-- 4. Seed Data Berita
INSERT INTO public.berita (title, excerpt, content, image_url, source_url)
VALUES
  (
    'Kementerian PU Percepat Digitalisasi Data Infrastruktur',
    'Pusdatin meluncurkan Insight Hub sebagai portal satu data untuk memudahkan akses informasi publik.',
    'Dalam upaya mendukung transparansi dan inovasi berbasis data, Kementerian Pekerjaan Umum melalui Pusdatin resmi meluncurkan Insight Hub. Platform ini mengintegrasikan berbagai dataset dari seluruh unit organisasi... (Konten lengkap berita).',
    'https://placehold.co/600x400/0D2A57/FFFFFF?text=Insight+Hub+Launch',
    'https://pu.go.id'
  ),
  (
    'Update Progres Pembangunan Bendungan Sepaku Semoi',
    'Bendungan penunjang IKN Nusantara ini ditargetkan rampung pada akhir tahun 2024.',
    'Pembangunan Bendungan Sepaku Semoi di Kalimantan Timur terus dikebut. Hingga saat ini, progres fisik telah mencapai 85%... (Konten lengkap berita).',
    'https://placehold.co/600x400/FFD100/0D2A57?text=Bendungan+IKN',
    'https://pu.go.id'
  );

-- 5. Seed Data Feedback
INSERT INTO public.feedback (user_name, gender, age_range, rating, suggestion)
VALUES
  ('Rina Melati', 'Perempuan', '21-30', 5, 'Sangat membantu untuk mencari data riset kuliah saya. Terima kasih!'),
  ('Budi Santoso', 'Laki-laki', '>40', 4, 'Tampilan dashboard sudah bagus, mungkin bisa ditambah fitur download PDF.'),
  ('Anonim', 'Laki-laki', '31-40', 3, 'Beberapa data API loadingnya agak lama, mohon diperbaiki.');

-- 6. Seed Data Permintaan Data
INSERT INTO public.data_requests (user_name, user_email, user_phone, organization, reason, status)
VALUES
  (
    'Dosen Teknik Sipil',
    'dosen@univ.ac.id',
    '081234567890',
    'Universitas Indonesia',
    'Membutuhkan data detail kondisi jembatan di Jawa Barat untuk penelitian akademis.',
    'pending'
  ),
  (
    'Konsultan Perencana',
    'konsultan@karya.com',
    '089876543210',
    'PT Karya Mandiri',
    'Data curah hujan harian di DAS Citarum tahun 2020-2023 untuk analisis banjir.',
    'approved'
  );

-- 7. Catatan untuk Developer (Komentar)
-- File ini tidak membuat user admin di tabel auth.users karena alasan keamanan.
-- Silakan buat user admin secara manual setelah menjalankan seed ini.