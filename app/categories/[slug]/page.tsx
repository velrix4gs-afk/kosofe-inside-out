import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

// Strict TypeScript interface instead of 'any' - safer for production
type Article = {
    id: string;
    title: string;
    excerpt: string;
    image_url: string | null;
    category: string;
    created_at: string;
    published: boolean;
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categorySlug = slug.replace(/-/g, ' ');
    const formattedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    let articles: Article[] | null = [];
    let errorMessage: string | null = null;

    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('category', formattedCategory)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) errorMessage = error.message;
        else articles = data as Article[];
    } catch (err: any) {
        errorMessage = err.message;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 uppercase">{formattedCategory}</h1>

            {errorMessage ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                    <p className="font-bold">Database Error</p>
                    <p className="text-sm break-words">{errorMessage}</p>
                </div>
            ) : (
                <>
                    {(!articles || articles.length === 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded text-center">
                            <p className="font-bold text-lg">No stories found</p>
                            <p className="text-sm mt-1">There are no published articles under &quot;{formattedCategory}&quot; yet. Check back soon!</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles?.map((story) => (
                            <Link key={story.id} href={`/articles/${story.id}`} className="bg-white rounded shadow-sm p-4 hover:shadow-md transition cursor-pointer block">

                                {/* REPLACED WITH NEXT.JS IMAGE COMPONENT */}
                                <div className="relative w-full h-48 bg-gray-200 rounded mb-3 overflow-hidden">
                                    <Image
                                        src={story.image_url || ''}
                                        alt={story.title}
                                        width={400}
                                        height={250}
                                        className="w-full h-full object-cover"
                                        unoptimized={true} // Fallback to prevent remote URL errors
                                    />
                                </div>

                                <h4 className="font-bold text-gray-800 line-clamp-2 text-lg">{story.title}</h4>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{story.excerpt}</p>
                                <span className="mt-3 inline-block text-xs font-bold text-[#c41e3a]">Read More &rarr;</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}