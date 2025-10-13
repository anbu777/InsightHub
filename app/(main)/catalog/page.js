import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';

// ========================
// 🔹 Komponen Dataset Card
// ========================
function DatasetCard({ dataset }) {
  return (
    <div className="border rounded-lg p-6 flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
      <div>
        {/* Logo API */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-api.png"
            alt="Logo API"
            width={129}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        <h3 className="text-xl font-bold text-blue-800 text-center">
          {dataset.name || 'Tanpa Judul'}
        </h3>

        <div className="mt-2 text-center">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            {dataset.category || 'Umum'}
          </span>
        </div>

        <p className="text-gray-600 mt-3 h-24 overflow-hidden text-sm text-center">
          {dataset.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <Link
        href={dataset.api_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center w-full mt-auto bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        LIHAT DETAIL
      </Link>
    </div>
  );
}

// ========================
// 🔹 Komponen Paginasi
// ========================
function Pagination({ currentPage, totalPages, search }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center mt-8">
      {pages.map(page => (
        <Link
          key={page}
          href={`/catalog?page=${page}${search ? `&search=${search}` : ''}`}
          className={`pagination-btn mx-1 px-3 py-1 border rounded-md text-sm ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-100'
          }`}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}

// ========================
// 🔹 Komponen Search Bar
// ========================
function SearchBar({ search }) {
  return (
    <div className="sticky top-24 z-30 bg-slate-200/80 backdrop-blur-sm py-4 mb-8 -mx-2 px-2 rounded-lg">
      <form action="/catalog" method="GET" className="relative flex-grow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          name="search"
          placeholder="Cari dataset atau informasi..."
          defaultValue={search}
          className="w-full pl-12 pr-4 py-3 bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </form>
    </div>
  );
}

// ========================
// 🔹 Halaman Utama Katalog
// ========================
export default async function CatalogPage({ searchParams }) {
  const supabase = createServerComponentClient({ cookies });
  const rowsPerPage = 12;

  const search = searchParams.search || '';
  const page = parseInt(searchParams.page || '1', 10);
  const offset = (page - 1) * rowsPerPage;

  let datasets = [];
  let count = 0;
  let errorMessage = null;

  try {
    // Query dasar
    let query = supabase.from('datasets').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count: totalCount } = await query
      .order('name', { ascending: true })
      .range(offset, offset + rowsPerPage - 1);

    if (error) throw error;

    datasets = data || [];
    count = totalCount || 0;
  } catch (err) {
    // Tampilkan isi lengkap dari error Supabase (kadang berupa objek kosong)
    console.error('Error fetching catalog data:', JSON.stringify(err, null, 2));
    errorMessage = err?.message || 'Terjadi kesalahan saat mengambil data katalog.';
  }

  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Katalog Data</h1>

      <SearchBar search={search} />

      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Terjadi Kesalahan</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {!errorMessage && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {datasets.length > 0 ? (
              datasets.map(dataset => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                {search
                  ? `Tidak ada data yang cocok untuk "${search}".`
                  : 'Belum ada data di dalam katalog.'}
              </p>
            )}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} search={search} />
        </>
      )}
    </div>
  );
}
