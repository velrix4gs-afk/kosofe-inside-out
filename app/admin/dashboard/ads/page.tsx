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
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchAds(); }, []);

    const fetchAds = async () => {
        const { data } = await supabase.from("advertisements").select("*").order("created_at", { ascending: false });
        setAds(data || []);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile && !videoFile) return;
        setLoading(true);

        let imageUrl = "";
        let videoUrl = "";

        // Upload Video if selected
        if (videoFile) {
            const videoName = `${Date.now()}_${videoFile.name}`;
            const { error: vidErr } = await supabase.storage.from("ad-videos").upload(videoName, videoFile);
            if (vidErr) { alert("Video upload failed: " + vidErr.message); setLoading(false); return; }
            const { data: vidUrl } = supabase.storage.from("ad-videos").getPublicUrl(videoName);
            videoUrl = vidUrl.publicUrl;
        }

        // Upload Image if selected
        if (imageFile) {
            const imgName = `${Date.now()}_${imageFile.name}`;
            const { error: imgErr } = await supabase.storage.from("ad-images").upload(imgName, imageFile);
            if (imgErr) { alert("Image upload failed: " + imgErr.message); setLoading(false); return; }
            const { data: imgUrl } = supabase.storage.from("ad-images").getPublicUrl(imgName);
            imageUrl = imgUrl.publicUrl;
        }

        const { error } = await supabase.from("advertisements").insert({
            title, image_url: imageUrl, video_url: videoUrl, link_url: linkUrl, placement, active: false,
        });

        setLoading(false);
        if (error) alert("Save failed: " + error.message);
        else {
            alert("Ad created! Activate it below.");
            setTitle(""); setLinkUrl(""); setImageFile(null); setVideoFile(null);
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

                <form onSubmit={handleUpload} className="space-y-4 mb-8">
                    <h3 className="font-bold text-lg">Create New Ad</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image</label>
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Video (MP4)</label>
                            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
                            <p className="text-[10px] text-gray-400">Leave blank if using image only.</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                        <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                        <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="w-full border p-2 rounded">
                            <option value="top_banner_hero">Top Banner (Big)</option>
                            <option value="top_banner_side">Top Banner (Small)</option>
                            <option value="sidebar">Sidebar</option>
                            <option value="in_article">In Article</option>
                            <option value="in_feed_video">In-Feed Video (Between Stories)</option> {/* <--- ADDED THIS */}
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {loading ? "Uploading..." : "Create Ad"}
                    </button>
                </form>

                <h3 className="font-bold text-lg mb-4">Your Ads</h3>
                <div className="space-y-4">
                    {ads.map((ad) => (
                        <div key={ad.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border p-4 rounded bg-gray-50 gap-4">
                            <div className="flex items-center gap-4">
                                {ad.video_url ? (
                                    <video src={ad.video_url} className="w-24 h-16 object-contain bg-white rounded" muted loop autoPlay playsInline />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={ad.image_url} alt={ad.title} className="w-24 h-16 object-contain bg-white rounded" />
                                )}
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