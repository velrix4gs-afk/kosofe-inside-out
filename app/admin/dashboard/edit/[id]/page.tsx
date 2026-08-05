"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import RichTextEditor from "@/components/RichTextEditor";

const AVAILABLE_TAGS = [
    'Politics', 'Governance', 'Community', 'Business', 'Sports',
    'Entertainment', 'Lifestyle', 'Technology', 'Health', 'Education',
    'Environment', 'Agriculture', 'Security', 'Religion', 'Opinion'
];

export default function EditStory({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', author: '', published: false
    });
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
            const { data: articleData } = await supabase.from('articles').select('*').eq('id', resolvedParams.id).single();
            if (articleData) {
                setForm({
                    title: articleData.title || '',
                    excerpt: articleData.excerpt || '',
                    content: articleData.content || '',
                    author: articleData.author || '',
                    published: articleData.published || false,
                });
                setSelectedTags(articleData.tags || []);
                const { data: galleryData } = await supabase.from('article_gallery').select('*').eq('article_id', resolvedParams.id);
                setGalleryImages(galleryData || []);
            }
            setLoading(false);
        };
        fetchData();
    }, [params]);

    useEffect(() => {
        const urls = imageFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [imageFiles]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
        else setSelectedTags([...selectedTags, tag]);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTags.length < 2) {
            alert("Please select at least 2 category tags for this story.");
            return;
        }
        setSaving(true);
        if (!id) return;

        // 1. Update basic text fields
        const { error } = await supabase.from('articles').update({
            title: form.title, excerpt: form.excerpt, content: form.content,
            author: form.author || 'Admin', published: form.published,
            category: selectedTags[0] || 'News', tags: selectedTags
        }).eq('id', id);

        if (error) { alert("Failed to update: " + error.message); setSaving(false); return; }

        // 2. Handle new image uploads
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const fileName = `${Date.now()}_${i}.${file.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('article-images').upload(fileName, file);
                if (uploadError) continue;
                const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
                const url = data.publicUrl;
                await supabase.from('article_gallery').insert({ article_id: id, image_url: url, is_main: false });
            }
        }

        setSaving(false);
        alert("Story updated!");
        router.push('/admin/dashboard');
    };

    const removeGalleryImage = async (galleryId: string, imageUrl: string) => {
        if (!confirm("Delete this gallery image?")) return;
        await supabase.from('article_gallery').delete().eq('id', galleryId);
        setGalleryImages(galleryImages.filter(img => img.id !== galleryId));
    };

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center font-bold text-gray-500">Loading story content...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Story</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Category Tags (Choose at least 2)</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${isSelected ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#c41e3a] hover:text-[#c41e3a]'}`}>
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Selected: {selectedTags.length} / 2 required minimum</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
                        <textarea rows={2} className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                        <RichTextEditor
                            key={form.content} // Forces stable remount on load
                            value={form.content}
                            onChange={(newContent) => setForm({ ...form, content: newContent })}
                        />
                        <div className="h-12"></div>
                    </div>

                    {/* --- EXISTING GALLERY IMAGES --- */}
                    {galleryImages.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Gallery Images</label>
                            <div className="flex flex-wrap gap-2">
                                {galleryImages.map((img) => (
                                    <div key={img.id} className="relative w-24 h-24 border rounded overflow-hidden group">
                                        <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(img.id, img.image_url)}
                                            className="absolute inset-0 bg-red-600/80 text-white font-bold group-hover:flex hidden items-center justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ADD NEW IMAGES --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add New Images</label>
                        <input type="file" multiple accept="image/*" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
                        {previewUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish immediately</label>
                        <div className="flex flex-col sm:flex-row gap-2 ml-auto w-full sm:w-auto">
                            <button type="button" onClick={() => router.push('/admin/dashboard')} className="bg-gray-200 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-300 w-full sm:w-auto">Cancel</button>
                            <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 w-full sm:w-auto">{saving ? 'Updating...' : 'Update Story'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}