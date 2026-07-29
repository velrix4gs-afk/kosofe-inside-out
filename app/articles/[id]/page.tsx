import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticleViewer from "@/components/ArticleViewer";

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

    const { data: galleryImages } = await supabase
        .from('article_gallery')
        .select('*')
        .eq('article_id', id)
        .order('created_at', { ascending: true });

    // Calculate Read Time
    const rawContent = article.content || '';
    const noHtml = rawContent.replace(/<[^>]*>?/gm, '');
    const noEntities = noHtml.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const plainText = noEntities.replace(/[*_`~#|>]/g, '').replace(/\n/g, ' ').trim();
    const wordCount = plainText.split(/\s+/).filter((word: string) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <ArticleViewer article={article} galleryImages={galleryImages} readTime={readTime} />
    );
}