"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const CONTENT_TYPES = [
    { id: 'gallery_photos', label: 'Photo Gallery', fields: ['title', 'image_url'], file: true },
    { id: 'videos', label: 'Videos', fields: ['title', 'video_url', 'description'], file: false },
    { id: 'podcasts', label: 'Podcasts', fields: ['title', 'audio_url', 'host'], file: false },
    { id: 'public_notices', label: 'Public Notices', fields: ['title', 'badge', 'content'], file: false },
    { id: 'obituaries', label: 'Obituaries', fields: ['title', 'content', 'image_url'], file: true },
];

export default function ContentManager() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('gallery_photos');
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', content: '', badge: '', host: '', description: '', image_url: '', video_url: '', audio_url: '' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const typeConfig = CONTENT_TYPES.find(t => t.id === selectedType)!;

    const fetchItems = async () => {
        const { data } = await supabase.from(selectedType).select('*').order('created_at', { ascending: false });
        setItems(data || []);
    };

    useEffect(() => { fetchItems(); }, [selectedType]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = form.image_url;
        // Upload image file if needed
        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage.from('article-images').upload(fileName, file);
            if (uploadError) { alert('Image upload failed: ' + uploadError.message); setLoading(false); return; }
            const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        const payload = { ...form, image_url: imageUrl, created_at: new Date().toISOString() } as Record<string, any>;
        // Remove empty fields
        Object.keys(payload).forEach(key => { if (payload[key] === '') delete payload[key]; });

        const { error } = await supabase.from(selectedType).insert(payload);
        setLoading(false);

        if (error) alert('Failed to add: ' + error.message);
        else {
            alert('Content added successfully!');
            setForm({ title: '', content: '', badge: '', host: '', description: '', image_url: '', video_url: '', audio_url: '' });
            setFile(null);
            fetchItems();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        const { error } = await supabase.from(selectedType).delete().eq('id', id);
        if (error) alert('Failed to delete: ' + error.message);
        else fetchItems();
    };

    if (!typeConfig) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <div className="flex items-center gap-4 mb-4 border-b pb-4">
                    <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">
                        ← Back
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Content</h1>
                </div>

                {/* Select Content Type */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {CONTENT_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 rounded text-sm font-bold transition ${selectedType === type.id ? 'bg-[#c41e3a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <h3 className="font-bold text-lg mb-4 border-b pb-2">Add to {typeConfig.label}</h3>
                <form onSubmit={handleUpload} className="space-y-3 mb-8">

                    {(typeConfig.fields.includes('title') || typeConfig.id === 'obituaries') && (
                        <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                    )}

                    {typeConfig.fields.includes('content') && (
                        <div><label className="block text-sm font-medium mb-1">Content / Description</label><textarea rows={3} className="w-full border p-2 rounded" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
                    )}
                    {typeConfig.fields.includes('badge') && (
                        <div><label className="block text-sm font-medium mb-1">Badge (e.g. ✅ Verified, 🏛 Government)</label><input type="text" className="w-full border p-2 rounded" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} /></div>
                    )}
                    {typeConfig.fields.includes('host') && (
                        <div><label className="block text-sm font-medium mb-1">Host Name</label><input type="text" className="w-full border p-2 rounded" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} /></div>
                    )}
                    {typeConfig.fields.includes('video_url') && (
                        <div><label className="block text-sm font-medium mb-1">YouTube/Vimeo Embed URL</label><input type="text" placeholder="https://www.youtube.com/embed/..." className="w-full border p-2 rounded" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} /></div>
                    )}
                    {typeConfig.fields.includes('audio_url') && (
                        <div><label className="block text-sm font-medium mb-1">Audio URL (MP3)</label><input type="text" className="w-full border p-2 rounded" value={form.audio_url} onChange={e => setForm({ ...form, audio_url: e.target.value })} /></div>
                    )}

                    {typeConfig.file && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Upload Image</label>
                            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Add Content'}
                    </button>
                </form>

                {/* List Items */}
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Existing {typeConfig.label}</h3>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border p-3 rounded bg-gray-50 gap-4">
                            <div className="flex items-center gap-4">
                                {item.image_url && <img src={item.image_url} className="w-16 h-12 object-cover rounded" />}
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{item.title || item.message || 'Untitled'}</p>
                                    <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold text-xs hover:underline">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}