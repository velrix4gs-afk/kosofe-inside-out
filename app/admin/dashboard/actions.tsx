'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteArticle(id: string) {
    // Delete from database
    await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    // Force clear cache for both the dashboard AND the public homepage
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
}