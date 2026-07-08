"use client";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function ArticleActionBar({ articleId }: { articleId: string }) {
    // Auto-increment views when someone opens the page
    useEffect(() => {
        const incrementViews = async () => {
            // Get current view count first
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
        // Run this once when the component mounts
        incrementViews();
    }, [articleId]);

    // The Share Button logic
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href,
            });
        } else {
            // Fallback for desktop browsers
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="mt-6 bg-white p-4 rounded shadow-sm flex flex-wrap justify-between items-center gap-4 border border-gray-100">
            <div className="flex gap-4 text-sm">
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-3 py-1.5 rounded">
                    <span>📤</span> Share
                </button>

                <button className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-3 py-1.5 rounded">
                    <span>💬</span> Comment
                </button>

                <button className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 px-3 py-1.5 rounded">
                    <span>🔖</span> Bookmark
                </button>
            </div>
            <a href="/" className="text-xs font-bold text-[#c41e3a] border border-[#c41e3a] px-3 py-1.5 rounded hover:bg-[#c41e3a] hover:text-white transition">
                ← Back
            </a>
        </div>
    );
}