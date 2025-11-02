// app/(admin)/beritas/actions.js
"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js'; // Impor client service role

// Fungsi bantu cek admin
async function checkAdminStatus(supabase) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    return !error && profile?.is_admin === true;
  } catch(error) {
      console.error("Exception checking admin status:", error);
      return false;
  }
}

// Helper untuk upload/hapus file (butuh service client)
// Pastikan ENV Var ini ada di .env.local
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabaseService.storage
    .from('berita-images') // Bucket yang kita buat
    .upload(fileName, file);
  
  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  // Dapatkan URL publik dari file yang baru di-upload
  const { data: publicUrlData } = supabaseService.storage
    .from('berita-images')
    .getPublicUrl(data.path);
  
  if (!publicUrlData.publicUrl) {
      throw new Error("Gagal mendapatkan URL publik gambar setelah upload.");
  }
  
  return publicUrlData.publicUrl;
}

async function deleteImage(imageUrl) {
    if (!imageUrl || !imageUrl.includes('berita-images/')) {
        console.warn("URL gambar tidak valid atau bukan dari storage, proses hapus dilewati:", imageUrl);
        return; // Bukan file storage kita, jangan dihapus
    }
    try {
        const fileName = imageUrl.split('berita-images/').pop();
        if (!fileName) return;

        console.log(`Mencoba menghapus gambar: ${fileName}`);
        const { error } = await supabaseService.storage
            .from('berita-images')
            .remove([fileName]);
            
        if (error) {
             console.error("Gagal menghapus gambar lama:", error);
             // Jangan gagalkan seluruh proses update jika hapus file lama gagal
        } else {
             console.log("Gambar lama berhasil dihapus.");
        }
    } catch (error) {
        console.error("Error saat menghapus gambar:", error);
    }
}


// Fungsi Create Berita (Revisi: Terima FormData)
export async function createBerita(formData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  // Ambil data dari FormData
  const title = formData.get('title');
  const excerpt = formData.get('excerpt');
  const content = formData.get('content');
  const source_url = formData.get('source_url') || null;
  const imageFile = formData.get('image_file');

  if (!title || !excerpt || !content || !imageFile || imageFile.size === 0) {
    return { success: false, message: 'Judul, Kutipan, Konten, dan Gambar wajib diisi.' };
  }

  try {
    // 1. Upload gambar dulu
    const imageUrl = await uploadImage(imageFile);

    // 2. Siapkan payload untuk database
    const payload = {
        title,
        excerpt,
        content,
        source_url,
        image_url: imageUrl, // Gunakan URL baru dari storage
    };

    const { data, error } = await supabase
      .from('berita')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Create Berita error:", error);
      // Jika insert gagal, hapus gambar yang baru di-upload
      await deleteImage(imageUrl); 
      return { success: false, message: `Gagal menambah berita: ${error.message}` };
    }

    revalidatePath('/beritas');
    revalidatePath('/');
    revalidatePath('/berita/[id]', 'layout');

    return { success: true, message: 'Berita baru berhasil dipublikasikan!', data };
  } catch (error) {
    console.error("Unexpected error in createBerita:", error.message);
    return { success: false, message: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Update Berita (Revisi: Terima FormData)
export async function updateBerita(formData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };
 
  // Ambil data dari FormData
  const id = formData.get('id');
  const title = formData.get('title');
  const excerpt = formData.get('excerpt');
  const content = formData.get('content');
  const source_url = formData.get('source_url') || null;
  const imageFile = formData.get('image_file'); // File gambar baru (jika ada)
  const old_image_url = formData.get('old_image_url'); // URL gambar lama

  if (!id || !title || !excerpt || !content) {
    return { success: false, message: 'Data tidak valid.' };
  }
  
  // Siapkan payload untuk database
  const payload = {
      title,
      excerpt,
      content,
      source_url,
      // image_url akan ditangani di bawah
  };

  try {
    // Jika ada file gambar baru yang di-upload
    if (imageFile && imageFile.size > 0) {
        // 1. Upload gambar baru
        const newImageUrl = await uploadImage(imageFile);
        payload.image_url = newImageUrl; // Set URL baru di payload
        
        // 2. Hapus gambar lama (jika ada)
        if (old_image_url) {
            await deleteImage(old_image_url);
        }
    }
    // Jika tidak ada file baru, payload tidak akan berisi image_url,
    // sehingga data di database tidak akan berubah (tetap URL lama).

    const { data, error } = await supabase
      .from('berita')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update Berita error:", error);
      return { success: false, message: `Gagal memperbarui berita: ${error.message}` };
    }

    revalidatePath('/beritas');
    revalidatePath(`/beritas/${id}/edit`);
    revalidatePath('/');
    revalidatePath(`/berita/${id}`); // Revalidate halaman detail publik

    return { success: true, message: 'Berita berhasil diperbarui!', data };
  } catch (error) {
    console.error("Unexpected error in updateBerita:", error.message);
    return { success: false, message: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}

// Fungsi Delete Berita (Revisi: Terima image_url)
export async function deleteBerita(id, imageUrl) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const isAdmin = await checkAdminStatus(supabase);
  if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

  if (!id) {
    return { success: false, message: 'ID berita tidak valid.' };
  }

  try {
    // 1. Hapus entri dari database
    const { error } = await supabase
      .from('berita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete Berita error:", error);
      return { success: false, message: `Gagal menghapus berita: ${error.message}` };
    }
    
    // 2. Jika database berhasil dihapus, hapus gambar dari storage
    if (imageUrl) {
        await deleteImage(imageUrl);
    }

    revalidatePath('/beritas');
    revalidatePath('/');
    revalidatePath('/berita/[id]', 'layout'); 

    return { success: true, message: 'Berita berhasil dihapus!' };
  } catch (error) {
    console.error("Unexpected error in deleteBerita:", error.message);
    return { success: false, message: error.message || 'Terjadi kesalahan tidak terduga.' };
  }
}