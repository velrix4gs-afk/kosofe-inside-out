"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Instant search with a debounce (wait 300ms after user stops typing)
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim() === "") {
                setResults([]);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('published', true)
                    .ilike('title', `%${query}%`)
                    .order('views', { ascending: false, nullsFirst: false })
                    .limit(20);

                if (error) setError(error.message);
                else setResults(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                Search Kosofe Inside Out
            </h1>

            {/* --- LIVE SEARCH BAR --- */}
            <div className="mb-6">
                <div className="flex gap-2 shadow-sm rounded">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type to instantly search articles..."
                        className="flex-1 border border-gray-300 rounded-l px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                        autoFocus
                    />
                    <div className="bg-[#c41e3a] text-white px-6 py-3 rounded-r font-bold flex items-center justify-center">
                        {loading ? "..." : "🔍"}
                    </div>
                </div>
            </div>

            {/* --- EMPTY STATE (When no typing has happened) --- */}
            {!query && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200 mt-6">
                    <p className="text-4xl mb-4">🔍</p>
                    <h3 className="font-bold text-lg text-gray-800">Enter a search term</h3>
                    <p className="text-sm text-gray-500 mt-1">Start typing above to see matching articles instantly.</p>
                </div>
            )}

            {/* --- ERROR STATE --- */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mt-6">
                    <p className="font-bold">Error searching articles</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* --- NO RESULTS --- */}
            {query && !loading && !error && results.length === 0 && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200 mt-6">
                    <h3 className="font-bold text-lg text-gray-800">No results found</h3>
                    <p className="text-sm text-gray-500 mt-1">We couldn't find any articles matching "{query}".</p>
                </div>
            )}

            {/* --- INSTANT RESULTS GRID --- */}
            {query && !loading && !error && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((story) => (
                        <Link
                            key={story.id}
                            href={`/articles/${story.id}`}
                            className="bg-white rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition block group"
                        >
                            <div className="relative h-48 bg-gray-200">
                                {story.image_url && (
                                    <Image
                                        src={story.image_url}
                                        alt={story.title}
                                        width={400}
                                        height={250}
                                        className="w-full h-full object-cover"
                                        unoptimized={true}
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <span className="text-[10px] font-bold text-[#c41e3a] uppercase mb-1 inline-block">
                                    {story.category || "News"}
                                </span>
                                <h4 className="font-bold text-gray-800 line-clamp-2 text-lg group-hover:text-[#c41e3a] transition-colors">
                                    {story.title}
                                </h4>
                                {story.excerpt && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {story.excerpt}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}