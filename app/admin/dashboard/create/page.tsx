"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateStory() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category: 'News', published: false, author: '' // Added author
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const handleUploadAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let mainImageUrl = '';
        const galleryUrls: string[] = [];

        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${i}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('article-images')
                    .upload(fileName, file);

                if (uploadError) {
                    alert("Image upload failed: " + uploadError.message);
                    setLoading(false);
                    return;
                }

                const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
                const url = data.publicUrl;

                if (i === 0) mainImageUrl = url;
                galleryUrls.push(url);
            }
        }

        // Insert with the author field
        const { data: articleData, error: articleError } = await supabase
            .from('articles')
            .insert({
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                image_url: mainImageUrl,
                published: form.published,
                author: form.author || 'Admin', // Defaults to Admin if left blank
            })
            .select()
            .single();

        if (articleError) {
            alert("Failed to save story: " + articleError.message);
            setLoading(false);
            return;
        }

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
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Write a New Story</h1>
                <form onSubmit={handleUploadAndSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>

                    {/* NEW AUTHOR INPUT FIELD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input type="text" placeholder="e.g. John Doe" className="w-full border p-2 rounded" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option>News</option>
                                <option>Politics</option>
                                <option>Governance</option>
                                <option>Community</option>
                                <option>Business</option>
                                <option>Sports</option>
                                <option>Entertainment</option>
                                <option>Opinion</option>
                                <option>Lifestyle</option>
                                <option>Technology</option>
                                <option>Environment</option>
                                <option>Agriculture</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Select multiple)</label>
                            <input type="file" multiple accept="image/*" className="w-full border p-1.5 rounded" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt (Summary)</label>
                        <textarea rows={2} className="w-full border p-2 rounded" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                        <textarea rows={8} required className="w-full border p-2 rounded" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                            Publish immediately
                        </label>
                        <button type="submit" disabled={loading} className="bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}