import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleActionBar from "@/components/ArticleActionBar";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('title, image_url').eq('id', id).single();
    return {
        title: article?.title || "Kosofe Inside Out",
        openGraph: { title: article?.title, description: "Read the latest news from Kosofe.", images: [article?.image_url || '/img/kio-logo.jpg'] },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch the main article
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (!article) notFound();

    // Fetch the gallery images for this article
    const { data: galleryImages } = await supabase
        .from('article_gallery')
        .select('*')
        .eq('article_id', id)
        .order('created_at', { ascending: true });

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
                    <span>By {article.author || 'Admin'}</span>
                    <span>•</span>
                    <span>{readTime} min read</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <span className="font-bold">👁️</span> {article.views || 0} views
                    </span>
                </div>

                {/* Main Display Image */}
                {article.image_url && (
                    <Image src={article.image_url} alt={article.title} width={800} height={450} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" unoptimized />
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* --- Gallery Sub-Section (The other images) --- */}
                {galleryImages && galleryImages.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Photo Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {galleryImages.map((img) => (
                                <div key={img.id} className="relative h-48 md:h-64 rounded overflow-hidden bg-gray-100 shadow-sm">
                                    <Image src={img.image_url} alt="Gallery image" fill className="object-cover" unoptimized />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            <ArticleActionBar articleId={article.id} />
        </div>
    );
}