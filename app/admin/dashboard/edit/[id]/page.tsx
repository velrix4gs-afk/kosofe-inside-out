"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
            const { data } = await supabase.from('articles').select('*').eq('id', resolvedParams.id).single();
            if (data) {
                setForm({
                    title: data.title || '',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    author: data.author || '',
                    published: data.published || false,
                });
                setSelectedTags(data.tags || []);
            }
            setLoading(false);
        };
        fetchData();
    }, [params]);

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

        const { error } = await supabase.from('articles').update({
            title: form.title, excerpt: form.excerpt, content: form.content,
            author: form.author || 'Admin', published: form.published,
            category: selectedTags[0] || 'News', tags: selectedTags
        }).eq('id', id);

        setSaving(false);
        if (error) alert("Failed to update: " + error.message);
        else { alert("Story updated!"); router.push('/admin/dashboard'); }
    };

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Story</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input type="text" className="w-full border p-2 rounded" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Category Tags (Choose at least 5)</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${isSelected ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#c41e3a] hover:text-[#c41e3a]'}`}>{tag}</button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Selected: {selectedTags.length} / 5 required minimum</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
                        <textarea rows={2} className="w-full border p-2 rounded" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                        <textarea rows={8} required className="w-full border p-2 rounded" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish immediately</label>
                        <div className="flex gap-2 ml-auto">
                            <button type="button" onClick={() => router.push('/admin/dashboard')} className="bg-gray-200 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">{saving ? 'Updating...' : 'Update Story'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}