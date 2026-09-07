"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdManager() {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [placement, setPlacement] = useState("top_banner");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        const { data } = await supabase.from("advertisements").select("*").order("created_at", { ascending: false });
        setAds(data || []);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return;
        setLoading(true);

        // Upload image to storage
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from("ad-images").upload(fileName, imageFile);
        if (uploadError) {
            alert("Upload failed: " + uploadError.message);
            setLoading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from("ad-images").getPublicUrl(fileName);
        const imageUrl = urlData.publicUrl;

        // Insert ad record
        const { error } = await supabase.from("advertisements").insert({
            title,
            image_url: imageUrl,
            link_url: linkUrl,
            placement,
            active: false,
        });

        setLoading(false);
        if (error) alert("Save failed: " + error.message);
        else {
            alert("Ad created! Activate it below.");
            setTitle("");
            setLinkUrl("");
            setImageFile(null);
            fetchAds();
        }
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from("advertisements").update({ active: !current }).eq("id", id);
        fetchAds();
    };

    const deleteAd = async (id: string) => {
        if (!confirm("Delete this ad?")) return;
        await supabase.from("advertisements").delete().eq("id", id);
        fetchAds();
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Manage Advertisements</h1>

                {/* Upload Form */}
                <form onSubmit={handleUpload} className="space-y-4 mb-8">
                    <h3 className="font-bold text-lg">Create New Ad</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                        <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                        <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="w-full border p-2 rounded">
                            <option value="top_banner">Top Banner</option>
                            <option value="sidebar">Sidebar</option>
                            <option value="in_article">In Article</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {loading ? "Uploading..." : "Create Ad"}
                    </button>
                </form>

                {/* List of Ads */}
                <h3 className="font-bold text-lg mb-4">Your Ads</h3>
                <div className="space-y-4">
                    {ads.map((ad) => (
                        <div key={ad.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border p-4 rounded bg-gray-50 gap-4">
                            <div className="flex items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={ad.image_url} alt={ad.title} className="w-24 h-16 object-contain bg-white rounded" />
                                <div>
                                    <p className="font-bold text-gray-800">{ad.title}</p>
                                    <p className="text-xs text-gray-500">Placement: {ad.placement}</p>
                                    <p className="text-xs text-gray-500">Status: {ad.active ? "Active" : "Inactive"}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleActive(ad.id, ad.active)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
                                    {ad.active ? "Deactivate" : "Activate"}
                                </button>
                                <button onClick={() => deleteAd(ad.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}