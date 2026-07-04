import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const categorySlug = params.slug.replace(/-/g, ' ');
    const formattedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    // --- DIAGNOSTIC CHECK: Are Vercel's Environment Variables being read? ---
    const envChecks = {
        urlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
    };

    let articles: any[] | null = [];
    let errorMessage: string | null = null;

    try {
        // If Vercel didn't read the variables, throw an error manually
        if (!envChecks.urlExists || !envChecks.keyExists) {
            throw new Error("Environment Variables missing in the Vercel Runtime!");
        }

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('category', formattedCategory)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) {
            errorMessage = `Supabase Error: ${error.message}`;
        } else {
            articles = data;
        }
    } catch (err: any) {
        errorMessage = `JavaScript Crash: ${err.message}`;
        // If the error is about missing variables, append the diagnostic info
        if (errorMessage.includes("Environment Variables")) {
            errorMessage += `\n\nDIAGNOSTIC INFO:\nURL configured: ${envChecks.urlExists}\nKey configured: ${envChecks.keyExists}\nURL Value (first 15 chars): ${envChecks.urlValue.substring(0, 15)}...`;
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 uppercase">{formattedCategory}</h1>

            {errorMessage ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded whitespace-pre-wrap">
                    <p className="font-bold">🚨 Server Error</p>
                    <p className="text-sm mt-2 break-words">{errorMessage}</p>
                    <p className="text-sm mt-4 text-gray-600">If you see 'Missing Environment Variables', go to Vercel Dashboard -> Settings -> Environment Variables, add them exactly as in your .env.local, and make sure to hit Redeploy.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles?.map((story) => (
                        <Link key={story.id} href={`/articles/${story.id}`} className="bg-white rounded shadow-sm p-4 hover:shadow-md transition cursor-pointer block">
                            <img src={story.image_url || ''} alt={story.title} className="w-full h-48 object-cover rounded mb-3 bg-gray-200" />
                            <h4 className="font-bold text-gray-800 line-clamp-2 text-lg">{story.title}</h4>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{story.excerpt}</p>
                            <span className="mt-3 inline-block text-xs font-bold text-[#c41e3a]">Read More &rarr;</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}