"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminMarketplace() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "", description: "", price: "", category: "Items", location: "", contact_phone: "", contact_email: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }
            fetchListings();
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const fetchListings = async () => {
        const { data } = await supabase.from("marketplace_listings").select("*").order("created_at", { ascending: false });
        setListings(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let imageUrl = "";
        if (imageFile) {
            const fileName = `market_${Date.now()}_${imageFile.name}`;
            const { error: uploadErr } = await supabase.storage.from("article-images").upload(fileName, imageFile);
            if (uploadErr) { alert("Image upload failed: " + uploadErr.message); setSaving(false); return; }
            const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        const { error } = await supabase.from("marketplace_listings").insert({ ...form, image_url: imageUrl, is_active: true });
        setSaving(false);
        if (error) alert("Failed: " + error.message);
        else {
            alert("Listing posted!");
            setForm({ title: "", description: "", price: "", category: "Items", location: "", contact_phone: "", contact_email: "" });
            setImageFile(null);
            fetchListings();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this listing?")) return;
        await supabase.from("marketplace_listings").delete().eq("id", id);
        fetchListings();
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from("marketplace_listings").update({ is_active: !current }).eq("id", id);
        fetchListings();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">← Back</Link>
                <h1 className="text-2xl font-bold text-gray-800">Manage Marketplace</h1>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Post a New Listing</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Listing Title *</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option>Items</option><option>Services</option><option>Rentals</option><option>Electronics</option><option>Furniture</option><option>Vehicles</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input type="text" placeholder="e.g. ₦15,000" className="w-full border p-2 rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input type="text" className="w-full border p-2 rounded" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Phone</label>
                            <input type="tel" className="w-full border p-2 rounded" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Email</label>
                            <input type="email" className="w-full border p-2 rounded" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image</label>
                            <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea rows={4} className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {saving ? "Posting..." : "Post Listing"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Active Listings ({listings.length})</h3>
                {listings.length === 0 ? <p className="text-gray-500 text-sm">No listings yet.</p> : (
                    <div className="space-y-3">
                        {listings.map(l => (
                            <div key={l.id} className="flex items-center justify-between gap-3 border p-3 rounded bg-gray-50">
                                <div className="flex items-center gap-3">
                                    {l.image_url && <img src={l.image_url} className="w-16 h-12 object-cover rounded" />}
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{l.title}</p>
                                        <p className="text-xs text-gray-500">{l.price || 'No price'} • {l.location || 'No location'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleActive(l.id, l.is_active)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">{l.is_active ? 'Hide' : 'Show'}</button>
                                    <button onClick={() => handleDelete(l.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}