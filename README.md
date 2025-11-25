# Insight Hub: API Catalog & Management Dashboard

<p align="center">
  <strong>Platform terpusat untuk manajemen, penemuan, dan visualisasi data API di Kementerian PU.</strong>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15 (App Router)-black?style=for-the-badge&logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Chart.js-Data_Viz-FF6384?style=for-the-badge&logo=chartdotjs" alt="Chart.js">
</p>

---

## 🎯 Latar Belakang & Tujuan

Dalam organisasi besar seperti Kementerian PU, puluhan unit kerja (Unor) mengembangkan dan mengonsumsi API internal. Tanpa platform terpusat, terjadi duplikasi pekerjaan, kesulitan dalam penemuan API, dan kurangnya visibilitas terhadap penggunaan data.

**Insight Hub** dirancang untuk memecahkan masalah ini dengan menyediakan "Single Source of Truth" (SSOT) untuk semua aset data API, mengubah cara data dikelola dan dibagikan secara internal.

---

## 🚀 Fitur Inti

* **Katalog API Publik & Internal:** Antarmuka yang bersih dan dapat dicari (`SearchForm.js`) bagi *developer* untuk menemukan dan memahami *endpoint* API yang tersedia.
* **Dashboard Admin Fungsional:** Panel admin yang komprehensif (`/admin-dashboard`) untuk mengelola (CRUD) API, kategori, unit kerja, dan konten berita.
* **Visualisasi Data (Chart.js):** Komponen dashboard interaktif (`DashboardClient.js`) yang memvisualisasikan metrik kunci seperti jumlah permintaan API, status umpan balik, dan total data.
* **Manajemen Status & Umpan Balik:** Sistem bagi admin untuk meninjau dan merespons permintaan akses API dan umpan balik pengguna (`DataRequestTable.js`, `FeedbackTable.js`).
* **Otentikasi Aman:** Alur *login* admin yang aman dan terproteksi (`/admin-login`) menggunakan **Supabase Auth**.

---

## ⚙️ Sorotan Arsitektur & Teknologi

Proyek ini tidak hanya tentang fitur, tetapi juga tentang membangun fondasi yang *scalable* dan *maintainable*.

### Tumpukan Teknologi Utama

| Kategori | Teknologi | Alasan Penggunaan |
| :--- | :--- | :--- |
| **Core Frontend** | **Next.js (App Router)** | Memanfaatkan *server components* dan *colocation* file untuk arsitektur yang logis dan performa tinggi. |
| **Styling** | **Tailwind CSS** | Menerapkan pendekatan *utility-first* untuk pengembangan UI yang cepat, konsisten, dan *maintainable* (fondasi untuk *design system*). |
| **Backend & Data** | **Supabase (BaaS)** | Bertindak sebagai *headless backend* untuk otentikasi, *database* (Postgres), dan *storage*. Ini memisahkan *frontend* dari *backend* dengan jelas. |
| **Visualisasi Data** | **Chart.js** | *Library* yang ringan dan kuat untuk membuat visualisasi data yang dinamis dan interaktif di *dashboard*. |
| **Animasi** | **Framer Motion** | Digunakan untuk memberikan transisi halaman dan interaksi mikro yang halus, meningkatkan pengalaman pengguna. |

### Keputusan Desain Arsitektural

* **Pemisahan *Public* vs. *Admin***: Proyek ini menggunakan *Route Groups* Next.js (`(main)` dan `(admin)`) untuk memisahkan alur pengguna publik dan admin, masing-masing dengan *layout* uniknya sendiri.
* **Server Actions & Client Components**: Menggunakan **Next.js Server Actions** (misal: `app/(admin)/catalogs/actions.js`) untuk mutasi data sisi server, mengurangi *boilerplate* API dan menjaga logika bisnis tetap aman di server.
* **Modularitas Komponen**: Komponen dipecah menjadi bagian-bagian yang dapat digunakan kembali (misal: `CatalogForm.js`, `NewsCard.js`) untuk mematuhi prinsip DRY (*Don't Repeat Yourself*).

---

## 📸 Galeri

<p align="center">
  Tampilan antarmuka aplikasi, mulai dari dashboard admin, manajemen data, hingga halaman detail.
</p>

<table align="center">
  <tr>
    <td align="center"><strong>Page Catalog</strong></td>
    <td align="center"><strong>Page Detail</strong></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/42d39eba-46a4-40ac-8f2a-89767c8ad67f" alt="Admin Dashboard" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/07d62c4f-75e3-4a1b-8f99-bbdb1c5a5a15" alt="Manajemen Data Katalog" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Admin Dashboard</strong></td>
    <td align="center"><strong>Tampilan Halaman Utama</strong></td>
  </tr>
   <tr>
    <td><img src="https://github.com/user-attachments/assets/b0cee82d-46c3-4f71-9d46-734ed1cac970" alt="Form Edit Data" width="100%"/></td>
    <td><img src="https://github.com/user-attachments/assets/4c6e3664-3dff-4a75-8ef1-77eb8f6e49f8" alt="Tampilan Halaman Utama" width="100%"/></td>
  </tr>
</table>

---

## Local Development

Untuk menjalankan proyek ini secara lokal:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/zaidanjibran/insight-hub.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Siapkan Environment Variables:**
    Buat file `.env.local` di *root* proyek dengan menyalin dari `.env.example`.
    ```bash
    cp .env.example .env.local
    ```
    (Kemudian edit `.env.local` dengan *keys* Supabase Anda)

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

© 2025 Zaidan Jibran Azhar. Semua Hak Dilindungi.
