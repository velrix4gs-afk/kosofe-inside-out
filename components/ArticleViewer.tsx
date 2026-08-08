"use client";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ArticleActionBar from "@/components/ArticleActionBar";
import { marked } from "marked";

marked.setOptions({
    gfm: true,
    breaks: true,
});

export default function ArticleViewer({ article, galleryImages, readTime }: any) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState({ url: '', alt: '' });

    const openLightbox = (url: string, alt: string) => {
        setLightboxImage({ url, alt });
        setLightboxOpen(true);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <ImageLightbox
                isOpen={lightboxOpen}
                imageUrl={lightboxImage.url}
                altText={lightboxImage.alt}
                onClose={() => setLightboxOpen(false)}
            />

            <article className="bg-white p-6 md:p-10 rounded shadow-sm w-full">
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
          THE "KEEP THE OLD ONE" FIX:
          We strip Gmail's hidden <body> wrapper so marked only sees the raw text.
          After that, marked.parse() handles `1.` and `2.` perfectly.
        */}
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed w-full text-left"
                    style={{ hyphens: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            let content = (article.content || '')
                                .replace(/&shy;|\u00AD/g, '')
                                .replace(/&nbsp;/g, ' ');

                            // STRIP OUT GMAIL'S FULL HTML WRAPPER
                            content = content.replace(/<body[^>]*>([\s\S]*)<\/body>/i, '$1');
                            content = content.replace(/<html[^>]*>([\s\S]*)<\/html>/i, '$1');

                            // Let marked handle everything
                            let parsed = marked.parse(content) as string;
                            return parsed.replace(/<iframe/g, '<iframe class="w-full aspect-video rounded mb-4"');
                        })()
                    }}
                />

                {/* Gallery Section */}
                {galleryImages && galleryImages.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">Photo Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {galleryImages.map((img: any) => (
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