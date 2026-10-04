"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminWeekReview() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "", summary: "", content: "",
        week_start_date: "", week_end_date: "", published: true
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }
            fetchReviews();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchReviews = async () => {
        const { data } = await supabase
            .from("week_reviews")
            .select("*")
            .order("created_at", { ascending: false });
        setReviews(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let coverUrl = "";
        if (coverFile) {
            const fileName = `week_${Date.now()}_${coverFile.name}`;
            const { error: uploadErr } = await supabase.storage.from("article-images").upload(fileName, coverFile);
            if (uploadErr) { alert("Cover upload failed: " + uploadErr.message); setSaving(false); return; }
            const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
            coverUrl = urlData.publicUrl;
        }

        const { error } = await supabase.from("week_reviews").insert({
            title: form.title,
            summary: form.summary,
            content: form.content,
            cover_image: coverUrl,
            week_start_date: form.week_start_date || null,
            week_end_date: form.week_end_date || null,
            published: form.published,
        });

        setSaving(false);
        if (error) {
            alert("Failed to save: " + error.message);
        } else {
            alert("Week in Review published successfully!");
            setForm({ title: "", summary: "", content: "", week_start_date: "", week_end_date: "", published: true });
            setCoverFile(null);
            fetchReviews();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this week in review?")) return;
        await supabase.from("week_reviews").delete().eq("id", id);
        fetchReviews();
    };

    const togglePublish = async (id: string, current: boolean) => {
        await supabase.from("week_reviews").update({ published: !current }).eq("id", id);
        fetchReviews();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Week in Review Manager</h1>
            </div>

            {/* CREATE FORM */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Publish New Week in Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input type="text" required className="w-full border p-2 rounded" placeholder="e.g. Week in Review: Sept 29 – Oct 5" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Week Start Date</label>
                            <input type="date" className="w-full border p-2 rounded" value={form.week_start_date} onChange={e => setForm({ ...form, week_start_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Week End Date</label>
                            <input type="date" className="w-full border p-2 rounded" value={form.week_end_date} onChange={e => setForm({ ...form, week_end_date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image</label>
                        <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Short Summary</label>
                        <textarea rows={2} className="w-full border p-2 rounded" placeholder="One paragraph intro..." value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Content (The weekly cover & summary)</label>
                        <textarea rows={10} className="w-full border p-2 rounded" placeholder="Write the full recap here..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                        Publish immediately
                    </label>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {saving ? "Publishing..." : "Publish Week in Review"}
                    </button>
                </form>
            </div>

            {/* LIST */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Published Weeks ({reviews.length})</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">No week in review posts yet.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map(r => (
                            <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border p-3 rounded bg-gray-50">
                                <div className="flex items-center gap-3">
                                    {r.cover_image && <img src={r.cover_image} className="w-16 h-12 object-cover rounded" />}
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{r.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {r.week_start_date && r.week_end_date
                                                ? `${new Date(r.week_start_date).toLocaleDateString()} – ${new Date(r.week_end_date).toLocaleDateString()}`
                                                : new Date(r.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {r.published ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                    <button onClick={() => togglePublish(r.id, r.published)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                        {r.published ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button onClick={() => handleDelete(r.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}