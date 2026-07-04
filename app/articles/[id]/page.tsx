import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Await the params (Fix for Next.js 15+)
    const { id } = await params;

    // 2. Fetch the specific article from Supabase
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    // 3. If the article doesn't exist, show a proper 404
    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <article className="bg-white p-6 md:p-10 rounded shadow-sm">
                {/* Displays the REAL title from your database now */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

                <div className="flex items-center text-sm text-gray-500 mb-6 border-b pb-4">
                    <span className="text-[#c41e3a] font-bold uppercase">{article.category}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>By {article.author || 'Admin'}</span>
                </div>

                {article.image_url && (
                    <img src={article.image_url} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" />
                )}

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>
        </div>
    );
}