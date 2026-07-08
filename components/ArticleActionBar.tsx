"use client";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import Link from "next/link";

export default function ArticleActionBar({ articleId }: { articleId: string }) {
    // Auto-increment views
    useEffect(() => {
        const incrementViews = async () => {
            const { data: current } = await supabase
                .from('articles')
                .select('views')
                .eq('id', articleId)
                .single();
            if (current) {
                await supabase
                    .from('articles')
                    .update({ views: (current.views || 0) + 1 })
                    .eq('id', articleId);
            }
        };
        incrementViews();
    }, [articleId]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="mt-6 bg-white p-4 rounded shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 border border-gray-100">
            {/* Left side: Action Buttons */}
            <div className="flex flex-wrap gap-3 text-sm w-full sm:w-auto">
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-4 py-2 rounded">
                    <span>📤</span> Share
                </button>
                <button className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-4 py-2 rounded">
                    <span>💬</span> Comment
                </button>
                <button className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-4 py-2 rounded">
                    <span>🔖</span> Bookmark
                </button>
            </div>

            {/* Right side: Back Button */}
            <Link href="/" className="text-sm text-gray-500 hover:text-[#c41e3a] underline font-medium transition-colors">
                ← Back to Home
            </Link>
        </div>
    );
}