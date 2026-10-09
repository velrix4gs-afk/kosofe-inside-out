"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminJobs() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "", company: "", location: "", salary: "", description: "", contact_email: "", contact_phone: ""
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }
            fetchJobs();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchJobs = async () => {
        const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
        setJobs(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.from("jobs").insert({ ...form, is_active: true });
        setSaving(false);
        if (error) alert("Failed: " + error.message);
        else {
            alert("Job posted!");
            setForm({ title: "", company: "", location: "", salary: "", description: "", contact_email: "", contact_phone: "" });
            fetchJobs();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this job?")) return;
        await supabase.from("jobs").delete().eq("id", id);
        fetchJobs();
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from("jobs").update({ is_active: !current }).eq("id", id);
        fetchJobs();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">← Back</Link>
                <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Post a New Job</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Title *</label>
                            <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Company *</label>
                            <input type="text" required className="w-full border p-2 rounded" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input type="text" className="w-full border p-2 rounded" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Salary</label>
                            <input type="text" placeholder="e.g. ₦80,000/month" className="w-full border p-2 rounded" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Email</label>
                            <input type="email" className="w-full border p-2 rounded" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Phone</label>
                            <input type="tel" className="w-full border p-2 rounded" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea rows={4} className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {saving ? "Posting..." : "Post Job"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Posted Jobs ({jobs.length})</h3>
                {jobs.length === 0 ? <p className="text-gray-500 text-sm">No jobs yet.</p> : (
                    <div className="space-y-3">
                        {jobs.map(j => (
                            <div key={j.id} className="flex items-center justify-between gap-3 border p-3 rounded bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{j.title}</p>
                                    <p className="text-xs text-gray-500">{j.company} • {j.location || 'No location'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${j.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{j.is_active ? 'ACTIVE' : 'CLOSED'}</span>
                                    <button onClick={() => toggleActive(j.id, j.is_active)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">{j.is_active ? 'Close' : 'Activate'}</button>
                                    <button onClick={() => handleDelete(j.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}