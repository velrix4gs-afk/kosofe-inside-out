import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ArchivesPage() {
    // 1. Fetch all necessary data for the archive
    const { data: articles } = await supabase
        .from('articles')
        .select('created_at, category, tags, local_gov, community')
        .eq('published', true);

    if (!articles) return <div className="max-w-6xl mx-auto px-4 py-8">Loading archives...</div>;

    // 2. Extract Years and Months
    const yearMap = new Map<string, Set<string>>();
    const years: string[] = [];

    articles.forEach(article => {
        const date = new Date(article.created_at);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('en-US', { month: 'long' });

        if (!years.includes(year)) years.push(year);
        if (!yearMap.has(year)) yearMap.set(year, new Set());
        yearMap.get(year)?.add(month);
    });
    years.sort((a, b) => parseInt(b) - parseInt(a));

    // 3. Extract unique Tags
    const allTags = new Set<string>();
    articles.forEach(a => a.tags?.forEach((t: string) => allTags.add(t)));
    const tagsList = Array.from(allTags).sort();

    // 4. Extract unique Local Governments
    const localGovs = [...new Set(articles.map(a => a.local_gov).filter(Boolean))].sort();

    // 5. Extract Categories
    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))].sort();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">News Archives</h1>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 text-sm uppercase mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <Link key={cat} href={`/categories/${cat.toLowerCase()}`} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-[#c41e3a] hover:text-white transition">
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow-sm border border-gray-200 md:col-span-2">
                    <h3 className="font-bold text-gray-800 text-sm uppercase mb-2">Browse by Month</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        {years.map(year => (
                            <div key={year} className="flex flex-col gap-1">
                                <span className="font-bold text-[#c41e3a]">{year}</span>
                                <div className="flex flex-wrap gap-1">
                                    {Array.from(yearMap.get(year) || []).map(month => (
                                        <Link key={month} href={`/archives/${year}/${month.toLowerCase()}`} className="text-gray-600 hover:text-[#c41e3a] hover:underline text-xs">
                                            {month}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 text-sm uppercase mb-2">Local Government</h3>
                    <div className="flex flex-wrap gap-2">
                        {localGovs.map(lg => (
                            <Link key={lg} href={`/archives/local-gov/${lg.toLowerCase().replace(/ /g, '-')}`} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-[#c41e3a] hover:text-white transition">
                                {lg}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Tag Cloud */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-8">
                <h3 className="font-bold text-gray-800 text-sm uppercase mb-4">Explore by Tag</h3>
                <div className="flex flex-wrap gap-2">
                    {tagsList.map(tag => (
                        <Link key={tag} href={`/archives/tag/${tag.toLowerCase().replace(/ /g, '-')}`} className="bg-gray-50 border border-gray-200 px-3 py-1 rounded text-sm hover:bg-[#c41e3a] hover:text-white hover:border-[#c41e3a] transition">
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
                <p>📚 {articles.length} published stories available in our archive.</p>
            </div>
        </div>
    );
}