// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If Vercel is missing the variables, this will throw an actual readable error instead of crashing the whole page.
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 CRITICAL ERROR: Supabase URL or Anon Key is missing. Did you add them to Vercel Environment Variables?");
    throw new Error("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);