import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleActionBar from "@/components/ArticleActionBar";
import { marked } from "marked";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('title, excerpt, image_url, category').eq('id', id).single();

    if (!article) {
        return {
            title: "Kosofe Inside Out",
            description: "News that shape our community.",
            openGraph: {
                title: "Kosofe Inside Out",
                description: "Read the latest news from Kosofe.",
                images: ['/img/kio-og-image.jpg']
            }
        };
    }

    const imageUrl = article.image_url || "https://kosofeinsideout.com/img/kio-og-image.jpg";

    return {
        title: article.title,
        description: article.excerpt || "Read the latest news from Kosofe.",
        openGraph: {
            title: article.title,
            description: article.excerpt || "Read the latest news from Kosofe.",
            url: `https://kosofeinsideout.com/articles/${id}`,
            siteName: "Kosofe Inside Out",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            type: "article",
            publishedTime: new Date().toISOString(),
            section: article.category || "News",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt || "Read the latest news from Kosofe.",
            images: [imageUrl],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
    if (!article) notFound();

    const rawContent = article.content || '';
    const noHtml = rawContent.replace(/<[^>]*>?/gm, '');
    const noEntities = noHtml.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const plainText = noEntities.replace(/[*_`~#|>]/g, '').replace(/\n/g, ' ').trim();
    const wordCount = plainText.split(/\s+/).filter((word: string) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <article className="bg-white p-6 md:p-10 rounded shadow-sm w-full overflow-hidden">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500 mb-6 border-b pb-4 gap-3">
                    <span className="text-[#c41e3a] font-bold uppercase">{article.category}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {article.author || 'Admin'}</span>
                    <span>•</span>
                    <span>{readTime} min read</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">👁️ {article.views || 0} views</span>
                </div>
                {article.image_url && (
                    <img src={article.image_url} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" />
                )}

                {/* Fixed: Cast marked.parse output to string before replacing */}
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed w-full text-left"
                    style={{ hyphens: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            const parsedContent = marked.parse(article.content || '') as string;
                            return parsedContent
                                .replace(/&shy;|\u00AD/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/<iframe/g, '<iframe class="w-full aspect-video rounded mb-4"');
                        })()
                    }}
                />
            </article>

            <ArticleActionBar articleId={article.id} />
        </div>
    );
}