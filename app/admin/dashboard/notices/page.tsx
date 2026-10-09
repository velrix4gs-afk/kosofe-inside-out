"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BADGES = ["✅ Verified", "🏛 Government", "🏫 School", "🏥 Health", "📢 Community", "💼 Business"];
const CATEGORIES = ["Government", "Community", "Education", "Employment", "Health", "Religious", "Family", "Business"];

export default function AdminNotices() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notices, setNotices] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "", content: "", source: "", badge: "✅ Verified", category: "Government", date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }
            fetchNotices();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchNotices = async () => {
        const { data } = await supabase.from("public_notices").select("*").order("created_at", { ascending: false });
        setNotices(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.from("public_notices").insert(form);
        setSaving(false);
        if (error) alert("Failed: " + error.message);
        else {
            alert("Notice posted!");
            setForm({ title: "", content: "", source: "", badge: "✅ Verified", category: "Government", date: new Date().toISOString().split('T')[0] });
            fetchNotices();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this notice?")) return;
        await supabase.from("public_notices").delete().eq("id", id);
        fetchNotices();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">← Back</Link>
                <h1 className="text-2xl font-bold text-gray-800">Manage Public Notices</h1>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Post a New Notice</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Badge</label>
                            <select className="w-full border p-2 rounded" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                                {BADGES.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Source</label>
                            <input type="text" placeholder="e.g. Kosofe Local Govt" className="w-full border p-2 rounded" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input type="date" className="w-full border p-2 rounded" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Content *</label>
                        <textarea rows={5} required className="w-full border p-2 rounded" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    </div>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {saving ? "Posting..." : "Post Notice"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Published Notices ({notices.length})</h3>
                {notices.length === 0 ? <p className="text-gray-500 text-sm">No notices yet.</p> : (
                    <div className="space-y-3">
                        {notices.map(n => (
                            <div key={n.id} className="flex items-start justify-between gap-3 border p-3 rounded bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{n.title}</p>
                                    <p className="text-xs text-gray-500">{n.badge} • {n.category} • {new Date(n.date || n.created_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => handleDelete(n.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}