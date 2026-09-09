import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function MostReadToday() {
    // 1. Get stories from the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    let { data: mostRead } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .gte('created_at', last24Hours)
        .order('views', { ascending: false })
        .limit(5);

    // 2. Fallback: If no stories in last 24h, fetch the top 5 overall
    if (!mostRead || mostRead.length === 0) {
        const { data: fallback } = await supabase
            .from('articles')
            .select('*')
            .eq('published', true)
            .order('views', { ascending: false })
            .limit(5);

        mostRead = fallback;
    }

    if (!mostRead || mostRead.length === 0) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 pb-12">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg text-gray-800">🔥 Most Read Today</h3>
                    <span className="text-xs text-gray-400">Top stories right now</span>
                </div>

                <div className="space-y-4">
                    {mostRead.map((story, idx) => (
                        <Link
                            key={story.id}
                            href={`/articles/${story.id}`}
                            className="flex items-start gap-4 p-2 rounded hover:bg-gray-50 transition group"
                        >
                            <span className="text-2xl font-extrabold text-gray-300 group-hover:text-[#c41e3a] transition-colors w-8 text-center">
                                {idx + 1}
                            </span>

                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-[#c41e3a] uppercase">
                                    {story.category || "News"}
                                </span>
                                <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#c41e3a] transition-colors">
                                    {story.title}
                                </h4>
                            </div>

                            <div className="text-right shrink-0 mt-1">
                                <p className="text-xs text-gray-500 font-bold">👁️ {story.views || 0}</p>
                                <p className="text-[10px] text-gray-400">{new Date(story.created_at).toLocaleDateString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}