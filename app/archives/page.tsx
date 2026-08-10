import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ArchivesPage() {
    const { data: articles } = await supabase
        .from('articles')
        .select('created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (!articles) return <div className="max-w-6xl mx-auto px-4 py-8">Loading archives...</div>;

    // Group by Year and Month
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">News Archives</h1>
            <div className="space-y-8">
                {years.map(year => (
                    <div key={year}>
                        <h2 className="text-2xl font-bold text-[#c41e3a] mb-4">{year}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {Array.from(yearMap.get(year) || []).sort().map(month => (
                                <Link
                                    key={month}
                                    href={`/archives/${year}/${month.toLowerCase()}`}
                                    className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:border-[#c41e3a] hover:shadow-md transition text-center"
                                >
                                    <span className="block font-bold text-gray-800 text-base">{month}</span>
                                    <span className="text-xs text-gray-400">{year}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}