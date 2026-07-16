"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BreakingNewsAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const checkUserAndFetch = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push('/admin/login');

            const { data } = await supabase.from('breaking_news').select('*').order('created_at', { ascending: false });
            setMessages(data || []);
            setLoading(false);
        };
        checkUserAndFetch();
    }, [router]);

    const addMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSubmitting(true);
        await supabase.from('breaking_news').insert({ message: newMessage });
        setNewMessage('');
        setSubmitting(false);
        // Refresh
        const { data } = await supabase.from('breaking_news').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Delete this breaking news item?')) return;
        await supabase.from('breaking_news').delete().eq('id', id);
        setMessages(messages.filter(m => m.id !== id));
    };

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Breaking News</h1>
                    <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-gray-500 hover:text-[#c41e3a]">← Back to Dashboard</button>
                </div>

                {/* Add New */}
                <form onSubmit={addMessage} className="mb-8 space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add a new alert</label>
                    <textarea
                        rows={2}
                        placeholder="e.g. Live: Traffic gridlock on Ikorodu Road..."
                        className="w-full border p-3 rounded focus:ring-1 focus:ring-[#c41e3a]"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={submitting} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                        {submitting ? 'Posting...' : 'Post Breaking News'}
                    </button>
                </form>

                {/* List Current */}
                <div>
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Active Alerts ({messages.length})</h3>
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                                <p className="text-sm text-gray-700 flex-1 mr-4">{msg.message}</p>
                                <button onClick={() => deleteMessage(msg.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}