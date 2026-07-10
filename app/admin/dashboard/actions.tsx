'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteArticle(id: string) {
    await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    // Clear cache for both the Dashboard AND the Homepage
    revalidatePath('/admin/dashboard');
    revalidatePath('/'); // <--- Add this line!
}