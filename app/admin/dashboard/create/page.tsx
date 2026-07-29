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

export default function CreateStory() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', author: '', published: false
    });
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Generate local preview URLs
    useEffect(() => {
        const urls = imageFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        // Cleanup memory when component unmounts
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [imageFiles]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleUploadAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTags.length < 2) {
            alert("Please select at least 2 category tags for this story.");
            return;
        }
        setLoading(true);
        let mainImageUrl = '';
        const galleryUrls: string[] = [];

        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${i}.${fileExt}`;
                const { error } = await supabase.storage.from('article-images').upload(fileName, file);
                if (error) { alert("Image upload failed: " + error.message); setLoading(false); return; }
                const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
                const url = data.publicUrl;
                if (i === 0) mainImageUrl = url;
                galleryUrls.push(url);
            }
        }

        const { data: articleData, error: articleError } = await supabase
            .from('articles')
            .insert({
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: selectedTags[0] || 'News',
                image_url: mainImageUrl,
                published: form.published,
                author: form.author || 'Admin',
                tags: selectedTags
            })
            .select()
            .single();

        if (articleError) { alert("Failed to save story: " + articleError.message); setLoading(false); return; }

        if (galleryUrls.length > 1) {
            const galleryInserts = galleryUrls.slice(1).map(url => ({
                article_id: articleData.id,
                image_url: url,
                is_main: false
            }));
            await supabase.from('article_gallery').insert(galleryInserts);
        }

        setLoading(false);
        router.push('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Write a New Story</h1>
                <form onSubmit={handleUploadAndSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input type="text" placeholder="e.g. John Doe" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Select multiple)</label>
                        <input type="file" multiple accept="image/*" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" onChange={e => setImageFiles(Array.from(e.target.files || []))} />

                        {/* IMAGE PREVIEW WINDOW */}
                        {previewUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden border-2 border-transparent shadow-sm">
                                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                        {idx === 0 && (
                                            <span className="absolute top-1 left-1 bg-[#c41e3a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase z-10">
                                                Main Display
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt (Summary)</label>
                        <textarea rows={2} className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                        <RichTextEditor
                            value={form.content}
                            onChange={(newContent) => setForm({ ...form, content: newContent })}
                        />
                        <div className="h-12"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                            Publish immediately
                        </label>
                        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 transition">
                            {loading ? 'Saving...' : 'Save Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}