"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticleActionBar({ articleId }: { articleId: string }) {
    // --- VIEWS LOGIC ---
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

    // --- BOOKMARK LOGIC (Saved to Browser Cache) ---
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        // Check if this article is bookmarked in localStorage on load
        const bookmarks = JSON.parse(localStorage.getItem('kio_bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(articleId));
    }, [articleId]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('kio_bookmarks') || '[]');
        let newBookmarks;
        if (isBookmarked) {
            // Remove
            newBookmarks = bookmarks.filter((id: string) => id !== articleId);
        } else {
            // Add
            newBookmarks = [...bookmarks, articleId];
        }
        localStorage.setItem('kio_bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    // --- COMMENT LOGIC (Captures Name, Comment, and Optional Email/Phone) ---
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentForm, setCommentForm] = useState({ name: '', comment: '', email: '', phone: '' });

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCommentLoading(true);

        const { error } = await supabase.from('article_comments').insert({
            article_id: articleId,
            name: commentForm.name,
            comment: commentForm.comment,
            email: commentForm.email || null,
            phone: commentForm.phone || null,
        });

        setCommentLoading(false);
        if (error) {
            alert("Error posting comment: " + error.message);
        } else {
            alert("Comment posted successfully!");
            setCommentForm({ name: '', comment: '', email: '', phone: '' });
            setShowCommentForm(false);
            // Optional: You can refresh the page to see the new comment
            window.location.reload();
        }
    };

    // --- SHARE LOGIC ---
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="mt-6 bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col gap-4">
            {/* Top Row: Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start w-full">
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded">
                    <span>📤</span> Share
                </button>

                <button onClick={() => setShowCommentForm(!showCommentForm)} className="flex items-center gap-2 text-gray-700 hover:text-[#c41e3a] transition-colors font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded">
                    <span>💬</span> Comment
                </button>

                {/* Bookmark button toggles color based on state */}
                <button onClick={toggleBookmark} className={`flex items-center gap-2 transition-colors font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded ${isBookmarked ? 'text-[#c41e3a]' : 'text-gray-700 hover:text-[#c41e3a]'}`}>
                    <span>{isBookmarked ? '🔖' : '🔖'}</span> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
            </div>

            {/* Bottom Row: Back Link */}
            <div className="flex justify-center sm:justify-end border-t pt-3">
                <Link href="/" className="text-sm text-gray-500 hover:text-[#c41e3a] underline transition-colors font-medium">
                    ← Back to Home
                </Link>
            </div>

            {/* --- COMMENT FORM (Toggles Open) --- */}
            {showCommentForm && (
                <div className="mt-2 pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-sm text-gray-800 mb-3">Leave a comment</h4>
                    <form onSubmit={handleCommentSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input type="text" placeholder="Your Name *" required className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#c41e3a]" value={commentForm.name} onChange={e => setCommentForm({ ...commentForm, name: e.target.value })} />
                            <input type="email" placeholder="Email (Optional)" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#c41e3a]" value={commentForm.email} onChange={e => setCommentForm({ ...commentForm, email: e.target.value })} />
                        </div>
                        <input type="tel" placeholder="Phone Number (Optional)" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#c41e3a]" value={commentForm.phone} onChange={e => setCommentForm({ ...commentForm, phone: e.target.value })} />
                        <textarea rows={3} placeholder="Your Comment *" required className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#c41e3a]" value={commentForm.comment} onChange={e => setCommentForm({ ...commentForm, comment: e.target.value })} />
                        <button type="submit" disabled={commentLoading} className="bg-[#c41e3a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#a0152e] disabled:opacity-50 transition">
                            {commentLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}