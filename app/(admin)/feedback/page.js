// app/(admin)/feedback/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// Impor komponen tabel dari folder dashboard (atau pindahkan jika perlu)
import FeedbackTable from '../admin-dashboard/FeedbackTable';

// Fungsi untuk mengambil SEMUA data feedback
async function getAllFeedback() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
     // Pastikan user adalah admin sebelum fetch
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    // const isAdmin = await checkAdminStatus(supabase, user.id);
    // if (!isAdmin) return [];

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching all feedback:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Critical error in getAllFeedback:", error);
    return [];
  }
}

// Komponen Halaman Daftar Feedback
export default async function FeedbackPage() {
  const allFeedback = await getAllFeedback();

  return (
    <div className="container mx-auto px-4 py-6">
       {/* Langsung render komponen tabel dengan SEMUA data */}
       <FeedbackTable
        // Berikan nama prop yang berbeda agar jelas ini adalah data lengkap
        initialFeedback={allFeedback}
        // Kita mungkin perlu menambahkan prop isFullPage={true}
       />
    </div>
  );
}

// (Fungsi checkAdminStatus bisa diimpor dari file utilitas atau didefinisikan di sini)