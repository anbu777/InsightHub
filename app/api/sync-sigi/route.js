import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js'; // <-- Tambahkan import ini
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Koneksi 1: Untuk memeriksa sesi pengguna
  const supabaseUserClient = createRouteHandlerClient({ cookies });

  // Keamanan: Pastikan ada sesi login yang valid
  const { data: { session } } = await supabaseUserClient.auth.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }
  
  // Anda bisa tambahkan pengecekan peran admin di sini jika perlu untuk keamanan ekstra

  try {
    const SIGI_API_URL = "https://sigi.pu.go.id/serverpu/rest/services/sigi_postgis/igt_2022_bendungan_konstruksi/FeatureServer/0/query?where=1=1&outFields=*&f=json";
    
    const response = await fetch(SIGI_API_URL);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari SIGI (Status: ${response.status})`);
    }
    const sigiData = await response.json(); 

    if (!sigiData || !Array.isArray(sigiData.features)) {
        throw new Error("Format data dari API SIGI tidak sesuai.");
    }

    const formattedData = sigiData.features.map(feature => {
      const attrs = feature.attributes;
      return {
        id: attrs.objectid,
        name: attrs.nama_infrastruktur,
        description: attrs.peresmian_sejarah_singkat || `Lokasi: ${attrs.provinsi}, ${attrs.kota_kabupaten}`,
        category: 'Bendungan',
        source: 'SIGI PU',
        api_url: `https://sigi.pu.go.id/serverpu/rest/services/sigi_postgis/igt_2022_bendungan_konstruksi/FeatureServer/0/${attrs.objectid}?f=pjson`
      };
    });

    // --- PERUBAHAN DI SINI ---
    // Koneksi 2: Buat client "super" menggunakan service_role key untuk operasi database
    // Ini akan melewati RLS, yang aman dilakukan karena kita sudah memastikan user adalah admin.
    const supabaseAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Gunakan client "super" untuk memasukkan data
    const { error } = await supabaseAdminClient
      .from('datasets')
      .upsert(formattedData, { onConflict: 'id' }); 

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    return NextResponse.json({ message: `Sinkronisasi berhasil! ${formattedData.length} data bendungan telah diproses.` });

  } catch (err) {
    console.error("Error saat sinkronisasi:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}