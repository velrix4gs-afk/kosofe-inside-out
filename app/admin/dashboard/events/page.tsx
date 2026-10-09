"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminEventsManager() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "", event_date: "", event_time: "", location: "", description: "", organizer: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }
            fetchEvents();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchEvents = async () => {
        const { data } = await supabase
            .from("events")
            .select("*")
            .order("event_date", { ascending: false });
        setEvents(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let imageUrl = "";
        if (imageFile) {
            const fileName = `event_${Date.now()}_${imageFile.name}`;
            const { error: uploadErr } = await supabase.storage.from("article-images").upload(fileName, imageFile);
            if (uploadErr) { alert("Image upload failed: " + uploadErr.message); setSaving(false); return; }
            const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        const { error } = await supabase.from("events").insert({
            title: form.title,
            event_date: form.event_date || null,
            event_time: form.event_time,
            location: form.location,
            description: form.description,
            organizer: form.organizer,
            image_url: imageUrl,
        });

        setSaving(false);
        if (error) {
            alert("Failed to save: " + error.message);
        } else {
            alert("Event posted successfully!");
            setForm({ title: "", event_date: "", event_time: "", location: "", description: "", organizer: "" });
            setImageFile(null);
            fetchEvents();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        await supabase.from("events").delete().eq("id", id);
        fetchEvents();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
            </div>

            {/* CREATE FORM */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Post a New Event</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Title *</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Date</label>
                            <input type="date" className="w-full border p-2 rounded" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Time</label>
                            <input type="text" placeholder="e.g. 10:00 AM" className="w-full border p-2 rounded" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" className="w-full border p-2 rounded" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Organizer</label>
                        <input type="text" className="w-full border p-2 rounded" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Image</label>
                        <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea rows={4} className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {saving ? "Posting..." : "Post Event"}
                    </button>
                </form>
            </div>

            {/* LIST */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Upcoming Events ({events.length})</h3>
                {events.length === 0 ? (
                    <p className="text-gray-500 text-sm">No events posted yet.</p>
                ) : (
                    <div className="space-y-3">
                        {events.map(ev => (
                            <div key={ev.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border p-3 rounded bg-gray-50">
                                <div className="flex items-center gap-3">
                                    {ev.image_url && <img src={ev.image_url} className="w-16 h-12 object-cover rounded" />}
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{ev.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'No date'} • {ev.location || 'No location'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(ev.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}