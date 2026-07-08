import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleActionBar from "@/components/ArticleActionBar";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('title, image_url').eq('id', id).single();

    return {
        title: article?.title || "Kosofe Inside Out",
        openGraph: {
            title: article?.title,
            description: "Read the latest news from Kosofe.",
            images: [article?.image_url || '/img/kio-logo.jpg'],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (!article) notFound();

    // Calculate Reading Time
    const wordCount = article.content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <article className="bg-white p-6 md:p-10 rounded shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

                {/* Meta Data Row */}
                <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500 mb-6 border-b pb-4 gap-3">
                    <span className="text-[#c41e3a] font-bold uppercase">{article.category}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{readTime} min read</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <span className="font-bold">👁️</span> {article.views || 0} views
                    </span>
                </div>

                {article.image_url && (
                    <img src={article.image_url} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" />
                )}

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>

            {/* The Interactive Action Bar */}
            <ArticleActionBar articleId={article.id} />
        </div>
    );
}