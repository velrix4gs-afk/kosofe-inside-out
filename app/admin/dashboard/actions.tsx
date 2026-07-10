'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteArticle(id: string) {
    // Delete the article from the database
    await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    // Force a refresh of the dashboard page
    revalidatePath('/admin/dashboard');
}