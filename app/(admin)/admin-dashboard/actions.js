// app/(admin)/admin-dashboard/actions.js

"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateRequestStatus(formData) {
    const supabase = createServerActionClient({ cookies });

    const id = formData.get('id');
    const status = formData.get('status');
    const response_link = formData.get('response_link');
    
    const { error } = await supabase
        .from('data_requests')
        .update({ 
            status, 
            response_link 
        })
        .eq('id', id);

    if (error) {
        console.error("Update request error:", error);
        return { success: false, message: 'Gagal memperbarui permohonan.' };
    }

    // Memberitahu Next.js untuk mengambil ulang data di halaman dashboard
    revalidatePath('/admin-dashboard');
    return { success: true, message: 'Permohonan berhasil diperbarui!' };
}