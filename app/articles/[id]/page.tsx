import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleActionBar from "@/components/ArticleActionBar";
import Link from "next/link";
import { marked } from "marked";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('title, image_url').eq('id', id).single();
    return { title: article?.title || "Kosofe Inside Out", openGraph: { title: article?.title, images: [article?.image_url || '/img/kio-logo.jpg'] } };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
    if (!article) notFound();

    // Fetch Related Stories (Same category, exclude current)
    const { data: related } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .eq('category', article.category)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

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
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed w-full text-left" style={{ hyphens: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: marked.parse(article.content.replace(/&shy;|\u00AD/g, '').replace(/&nbsp;/g, ' ')) }} />
                {/* --- SEO STRUCTURED DATA (JSON-LD) --- */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            "headline": article.title,
                            "image": [article.image_url],
                            "datePublished": article.created_at,
                            "dateModified": article.created_at,
                            "author": {
                                "@type": "Person",
                                "name": article.author || "Admin"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Kosofe Inside Out",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://kosofeinsideout.com/img/kio-logo.jpg"
                                }
                            }
                        })
                    }}
                />
            </article>

            {/* --- ACTION BAR & METRICS / CTA SECTION --- */}
            <ArticleActionBar articleId={article.id} />

            {/* Related Stories & Site Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Related Stories (Takes up 2 columns) */}
                <div className="md:col-span-2 bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">Related Stories</h3>
                    <div className="space-y-4">
                        {related && related.length > 0 ? (
                            related.map((story) => (
                                <Link key={story.id} href={`/articles/${story.id}`} className="block border-b border-gray-100 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded transition">
                                    <h4 className="font-bold text-gray-800 hover:text-[#c41e3a] text-sm">{story.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{story.category} • {new Date(story.created_at).toLocaleDateString()}</p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No related stories found.</p>
                        )}
                    </div>
                </div>

                {/* Stats & CTA (Takes up 1 column) */}
                <div className="bg-gray-50 p-6 rounded shadow-sm border border-gray-200 flex flex-col gap-4">
                    <div className="space-y-2 pb-4 border-b border-gray-200">
                        <h4 className="font-bold text-[#c41e3a] uppercase text-xs">Kosofe Inside Out</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="block font-bold text-gray-800">25,000+</span><span className="text-gray-500">Monthly Readers</span></div>
                            <div><span className="block font-bold text-gray-800">18,000+</span><span className="text-gray-500">Facebook Followers</span></div>
                            <div><span className="block font-bold text-gray-800">6,000+</span><span className="text-gray-500">WhatsApp Subscribers</span></div>
                            <div><span className="block font-bold text-gray-800">2026</span><span className="text-gray-500">Serving Kosofe Since</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a href="https://whatsapp.com/channel/0029Vb7tfwGIiRoytADSsU1L" target="_blank" className="bg-[#25D366] text-white text-center py-2 rounded font-bold text-sm hover:opacity-90">Follow WhatsApp Channel</a>
                        <Link href="/advertise" className="border border-[#c41e3a] text-[#c41e3a] text-center py-2 rounded font-bold text-sm hover:bg-[#c41e3a] hover:text-white transition">Advertise Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}