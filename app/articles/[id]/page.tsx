import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleActionBar from "@/components/ArticleActionBar";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";

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

    // Fetch gallery images
    const { data: galleryImages } = await supabase
        .from('article_gallery')
        .select('*')
        .eq('article_id', id)
        .order('created_at', { ascending: true });

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState({ url: '', alt: '' });

    const openLightbox = (url: string, alt: string) => {
        setLightboxImage({ url, alt });
        setLightboxOpen(true);
    };

    // Calculate Read Time
    const rawContent = article.content || '';
    const noHtml = rawContent.replace(/<[^>]*>?/gm, '');
    const noEntities = noHtml.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const plainText = noEntities.replace(/[*_`~#|>]/g, '').replace(/\n/g, ' ').trim();
    const wordCount = plainText.split(/\s+/).filter((word: string) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Lightbox Component */}
            <ImageLightbox
                isOpen={lightboxOpen}
                imageUrl={lightboxImage.url}
                altText={lightboxImage.alt}
                onClose={() => setLightboxOpen(false)}
            />

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

                {/* Main Image */}
                {article.image_url && (
                    <div
                        className="w-full h-64 md:h-96 bg-gray-200 rounded mb-6 overflow-hidden relative cursor-pointer group"
                        onClick={() => openLightbox(article.image_url, article.title)}
                    >
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/80 text-gray-800 px-3 py-1 rounded text-sm font-bold">🔍 View Full</span>
                        </div>
                    </div>
                )}

                {/* 
          THE PERMANENT FIX: 
          Removed 'marked.parse' because the editor already saves valid HTML. 
          This ensures formatting, lists, and embedded images render perfectly.
        */}
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed w-full text-left"
                    style={{ hyphens: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{
                        __html: (article.content || '')
                            .replace(/&shy;|\u00AD/g, '')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/<iframe/g, '<iframe class="w-full aspect-video rounded mb-4"')
                    }}
                />

                {/* Gallery Section */}
                {galleryImages && galleryImages.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Photo Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {galleryImages.map((img) => (
                                <div
                                    key={img.id}
                                    className="relative h-48 md:h-64 rounded overflow-hidden bg-gray-100 shadow-sm cursor-pointer group"
                                    onClick={() => openLightbox(img.image_url, 'Gallery image')}
                                >
                                    <img src={img.image_url} alt="Gallery image" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white/80 text-gray-800 px-3 py-1 rounded text-sm font-bold">🔍 View Full</span>
                                    </div>
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