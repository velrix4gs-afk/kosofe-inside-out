// app/categories/[slug]/page.tsx
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    // Convert "politics" to "Politics" to match database
    const categorySlug = params.slug.replace(/-/g, ' ');
    const formattedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('category', formattedCategory)
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 uppercase">{formattedCategory}</h1>

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
        </div>
    );
}