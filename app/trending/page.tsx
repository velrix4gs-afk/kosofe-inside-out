import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function TrendingPage() {
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">🔥 Trending Now</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles?.map((story, idx) => (
                    <Link key={story.id} href={`/articles/${story.id}`} className="bg-white rounded shadow-sm p-4 hover:shadow-md transition cursor-pointer block border-l-4 border-[#c41e3a]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-0.5 rounded-full">#{idx + 1}</span>
                            <span className="text-xs text-gray-500 uppercase">{story.category}</span>
                        </div>
                        <img src={story.image_url || ''} alt={story.title} className="w-full h-40 object-cover rounded mb-3 bg-gray-200" />
                        <h4 className="font-bold text-gray-800 line-clamp-2 text-lg">{story.title}</h4>
                    </Link>
                ))}
            </div>
        </div>
    );
}