import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MonthArchive({ params }: { params: Promise<{ year: string; month: string }> }) {
    const { year, month } = await params;

    // Convert "august" to 8
    const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;
    if (isNaN(monthIndex)) notFound();

    // Create start and end date for the month (Lagos Timezone safety)
    const startDate = new Date(parseInt(year), monthIndex - 1, 1);
    const endDate = new Date(parseInt(year), monthIndex, 0);

    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800 capitalize">{month} {year} Archives</h1>
                <Link href="/archives" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back to Archives</Link>
            </div>

            {(!articles || articles.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No stories this month</h3>
                    <p className="text-sm text-gray-500 mt-1">Check back later or view the main archives.</p>
                </div>
            )}

            {articles && articles.length > 0 && (
                <div className="space-y-4">
                    {articles.map((story) => (
                        <Link key={story.id} href={`/articles/${story.id}`} className="block bg-white p-4 md:p-6 rounded shadow-sm border-l-4 border-[#c41e3a] hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 hover:text-[#c41e3a] transition-colors">{story.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{story.excerpt}</p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(story.created_at).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}