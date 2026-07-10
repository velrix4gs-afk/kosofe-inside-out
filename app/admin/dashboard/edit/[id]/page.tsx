"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditStory({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category: 'News', published: false, author: '' // Added author
    });

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);

            const { data } = await supabase
                .from('articles')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (data) {
                setForm({
                    title: data.title || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    category: data.category || 'News',
                    published: data.published || false,
                    author: data.author || '', // Load existing author
                });
            }
            setLoading(false);
        };
        fetchData();
    }, [params]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (!id) return;

        const { error } = await supabase
            .from('articles')
            .update({
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                published: form.published,
                author: form.author || 'Admin', // Update author or fallback to Admin
            })
            .eq('id', id);

        setSaving(false);

        if (error) {
            alert("Failed to update story: " + error.message);
        } else {
            alert("Story updated successfully!");
            router.push('/admin/dashboard');
        }
    };

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center">Loading story...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Story</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>

                    {/* NEW AUTHOR INPUT FIELD IN EDIT FORM */}
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
                        <div className="flex gap-2 ml-auto">
                            <button type="button" onClick={() => router.push('/admin/dashboard')} className="bg-gray-200 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                                {saving ? 'Saving...' : 'Update Story'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}