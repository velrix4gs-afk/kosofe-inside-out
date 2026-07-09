'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function approveBusiness(id: string) {
    await supabase
        .from('directory_entries')
        .update({ approved: true })
        .eq('id', id);

    // Refresh the admin page instantly
    revalidatePath('/admin/directory');
}

export async function rejectBusiness(id: string) {
    await supabase
        .from('directory_entries')
        .delete()
        .eq('id', id);

    revalidatePath('/admin/directory');
}