Tentu, ini adalah draf `README.md` yang telah diperbarui secara komprehensif. Revisi ini mencakup fitur-fitur baru yang telah kita implementasikan (seperti *Upload* CSV Otomatis dengan Edge Functions, Inspeksi API, dan Integrasi Email Resend), serta panduan *setup* database yang lebih lengkap menggunakan file `schema.sql` dan `seed.sql`.

Silakan ganti seluruh isi `README.md` Anda dengan konten di bawah ini:

-----

# Insight Hub: API Catalog & Management Dashboard

\<p align="center"\>
\<strong\>Platform terpusat untuk manajemen, penemuan, dan visualisasi data API di Kementerian PU.\</strong\>
\</p\>

\<p align="center"\>
\<img src="[https://img.shields.io/badge/Next.js-15](https://img.shields.io/badge/Next.js-15) (App Router)-black?style=for-the-badge\&logo=nextdotjs" alt="Next.js"\>
\<img src="[https://img.shields.io/badge/Tailwind\_CSS-4-38B2AC?style=for-the-badge\&logo=tailwind-css](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)" alt="Tailwind CSS"\>
\<img src="[https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge\&logo=supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase)" alt="Supabase"\>
\<img src="[https://img.shields.io/badge/Supabase-Edge](https://www.google.com/search?q=https://img.shields.io/badge/Supabase-Edge) Functions-3ECF8E?style=for-the-badge\&logo=deno" alt="Edge Functions"\>
\<img src="[https://img.shields.io/badge/Chart.js-Data\_Viz-FF6384?style=for-the-badge\&logo=chartdotjs](https://img.shields.io/badge/Chart.js-Data_Viz-FF6384?style=for-the-badge&logo=chartdotjs)" alt="Chart.js"\>
\<img src="[https://img.shields.io/badge/Resend-Email\_API-000000?style=for-the-badge\&logo=resend](https://www.google.com/search?q=https://img.shields.io/badge/Resend-Email_API-000000%3Fstyle%3Dfor-the-badge%26logo%3Dresend)" alt="Resend"\>
\</p\>

-----

## 🎯 Latar Belakang & Tujuan

Dalam organisasi besar seperti Kementerian PU, puluhan unit kerja (Unor) mengembangkan dan mengonsumsi API internal. Tanpa platform terpusat, terjadi duplikasi pekerjaan, kesulitan dalam penemuan API, dan kurangnya visibilitas terhadap penggunaan data.

**Insight Hub** dirancang untuk memecahkan masalah ini dengan menyediakan "Single Source of Truth" (SSOT) untuk semua aset data API, mengubah cara data dikelola dan dibagikan secara internal. Proyek ini bertujuan untuk merapikan data API yang tidak terstruktur menjadi format yang standar dan mudah diakses.

-----

## 🚀 Fitur Inti

### Sisi Publik (User)

  * **Katalog API Publik & Internal:** Antarmuka yang bersih dan dapat dicari (`SearchForm.js`) bagi *developer* untuk menemukan dan memahami *endpoint* API yang tersedia.
  * **Berita & Informasi Terkini:** Modul berita yang dinamis dengan tampilan modern (`NewsCard.js`, `BeritaTerkini.js`) untuk menyampaikan pembaruan terkait data.
  * **Formulir Interaktif dengan Keamanan:** Formulir permintaan data dan survei kepuasan yang dilengkapi dengan **Cloudflare Turnstile** untuk mencegah spam.
  * **Notifikasi Otomatis:** Integrasi dengan **Resend** untuk mengirim email konfirmasi otomatis kepada pengguna saat mengajukan permintaan.

### Sisi Admin (Dashboard)

  * **Manajemen Katalog Canggih (`/catalogs`):**
      * **Opsi 1: Upload CSV Otomatis:** Fitur unggulan yang menggunakan **Supabase Edge Functions** untuk memproses file CSV yang diunggah, secara otomatis membuat tabel database baru, menerapkan aturan keamanan (RLS), dan mendaftarkan API endpoint-nya ke katalog.
      * **Opsi 2: Inspeksi API Endpoint:** Fitur cerdas untuk memindai URL API eksternal, secara otomatis mengekstrak sampel data dan metadata JSON untuk mempercepat pengisian formulir katalog.
  * **Manajemen Konten Lengkap (CRUD):** Kelola Unit Organisasi (UNOR), Kategori, dan Berita (termasuk upload gambar langsung ke Storage).
  * **Dashboard Analitik:** Visualisasi data interaktif (`DashboardClient.js`) untuk memantau metrik kunci seperti dataset populer, distribusi kategori, dan kepuasan pengguna.
  * **Manajemen Permintaan:** Tinjau permintaan data masuk, ubah status (Approved/Rejected), dan sistem akan otomatis mengirim email notifikasi berisi link API kepada pemohon.

-----

## ⚙️ Sorotan Arsitektur & Teknologi

### Tumpukan Teknologi Utama

| Kategori | Teknologi | Alasan Penggunaan |
| :--- | :--- | :--- |
| **Core Frontend** | **Next.js (App Router)** | Memanfaatkan *server components* dan *colocation* file untuk arsitektur yang logis dan performa tinggi. |
| **Backend Logic** | **Supabase Edge Functions** | Menjalankan logika server-side yang kompleks (seperti parsing CSV dan DDL database) dalam lingkungan Deno yang aman dan terisolasi. |
| **Database & Storage** | **Supabase (Postgres)** | Bertindak sebagai *headless backend* untuk otentikasi, database relasional, dan penyimpanan file (Storage Buckets). |
| **Email Service** | **Resend** | Layanan email API-first untuk pengiriman notifikasi transaksional yang andal. |
| **Keamanan** | **Cloudflare Turnstile** | Solusi CAPTCHA modern yang melindungi formulir publik tanpa mengganggu pengalaman pengguna. |

### Keputusan Desain Arsitektural

  * **Pemisahan *Public* vs. *Admin***: Menggunakan *Route Groups* Next.js (`(main)` dan `(admin)`) untuk memisahkan alur pengguna publik dan admin.
  * **Automated Data Pipeline**: Implementasi *pipeline* data menggunakan Edge Function (`process-csv-upload`) yang memungkinkan admin non-teknis untuk mengubah file statis (CSV) menjadi API *endpoint* yang hidup dan aman secara instan.
  * **Keamanan Berlapis**: Menggunakan Row Level Security (RLS) pada tingkat database untuk memastikan data hanya bisa diakses oleh pihak yang berwenang, serta validasi input yang ketat di sisi server.

-----

## 📸 Galeri

\<p align="center"\>
Tampilan antarmuka aplikasi, mulai dari dashboard admin, manajemen data, hingga halaman detail.
\</p\>

\<table align="center"\>
\<tr\>
\<td align="center"\>\<strong\>Page Catalog\</strong\>\</td\>
\<td align="center"\>\<strong\>Page Detail\</strong\>\</td\>
\</tr\>
\<tr\>
\<td\>\<img src="[https://github.com/user-attachments/assets/42d39eba-46a4-40ac-8f2a-89767c8ad67f](https://github.com/user-attachments/assets/42d39eba-46a4-40ac-8f2a-89767c8ad67f)" alt="Halaman Katalog" width="100%"/\>\</td\>
\<td\>\<img src="[https://github.com/user-attachments/assets/07d62c4f-75e3-4a1b-8f99-bbdb1c5a5a15](https://github.com/user-attachments/assets/07d62c4f-75e3-4a1b-8f99-bbdb1c5a5a15)" alt="Halaman Detail" width="100%"/\>\</td\>
\</tr\>
\<tr\>
\<td align="center"\>\<strong\>Admin Dashboard\</strong\>\</td\>
\<td align="center"\>\<strong\>Tampilan Halaman Utama\</strong\>\</td\>
\</tr\>
\<tr\>
\<td\>\<img src="[https://github.com/user-attachments/assets/b0cee82d-46c3-4f71-9d46-734ed1cac970](https://github.com/user-attachments/assets/b0cee82d-46c3-4f71-9d46-734ed1cac970)" alt="Admin Dashboard" width="100%"/\>\</td\>
\<td\>\<img src="[https://github.com/user-attachments/assets/4c6e3664-3dff-4a75-8ef1-77eb8f6e49f8](https://github.com/user-attachments/assets/4c6e3664-3dff-4a75-8ef1-77eb8f6e49f8)" alt="Halaman Utama" width="100%"/\>\</td\>
\</tr\>
\</table\>

-----

## 💻 Local Development (Panduan Setup)

Ikuti langkah ini secara berurutan untuk menjalankan proyek ini di komputer lokal Anda.

### 1\. Persiapan Lingkungan

1.  **Clone repository:**
    ```bash
    git clone https://github.com/zaidanjibran/insight-hub.git
    cd insight-hub
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Siapkan Docker (Wajib):**
      * Install dan jalankan [Docker Desktop](https://www.docker.com/products/docker-desktop/).
      * Pastikan status Docker adalah "Running" (Hijau). Docker diperlukan untuk men-deploy Supabase Edge Functions.
4.  **Install Supabase CLI:**
    ```bash
    npm install supabase --save-dev
    ```

### 2\. Konfigurasi Environment

Buat file `.env.local` di *root* proyek dengan menyalin dari `.env.example`. Minta kunci API (API Keys) kepada pengelola proyek atau buat proyek Supabase baru.

```bash
cp .env.example .env.local
```

Isi variabel berikut:

  * `NEXT_PUBLIC_SUPABASE_URL` & `ANON_KEY`
  * `SUPABASE_SERVICE_ROLE_KEY` (Penting untuk fungsi admin)
  * `RESEND_API_KEY` (Untuk email)
  * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` & `SECRET_KEY` (Opsional, untuk Captcha)

### 3\. Setup Database & Backend

1.  **Login ke Supabase CLI:**
    ```bash
    npx supabase login
    ```
2.  **Hubungkan ke Proyek Cloud:**
    ```bash
    npx supabase link --project-ref <PROJECT-ID-ANDA>
    ```
3.  **Terapkan Struktur Database (Schema):**
    Salin isi file `supabase/schema.sql` dan jalankan di SQL Editor dashboard Supabase Anda. Ini akan membuat semua tabel, fungsi, dan kebijakan keamanan.
4.  **Isi Data Awal (Seed):**
    Salin isi file `supabase/seed.sql` dan jalankan di SQL Editor. Ini akan mengisi data dummy.
5.  **Deploy Edge Function (PENTING):**
    Jalankan perintah ini untuk mengaktifkan fitur upload CSV otomatis:
    ```bash
    npx supabase functions deploy process-csv-upload --no-verify-jwt
    ```

### 4\. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.

-----

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

© 2025 Zaidan Jibran Azhar. Semua Hak Dilindungi.