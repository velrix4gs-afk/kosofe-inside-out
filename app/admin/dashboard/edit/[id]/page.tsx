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

    // --- IMAGE EDITING STATES ---
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [existingGallery, setExistingGallery] = useState<any[]>([]);

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

                // Load current images
                setMainImagePreview(articleData.image_url || null);

                const { data: galleryData } = await supabase
                    .from('article_gallery')
                    .select('*')
                    .eq('article_id', resolvedParams.id);
                setExistingGallery(galleryData || []);
            }
            setLoading(false);
        };
        fetchData();
    }, [params]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
        else setSelectedTags([...selectedTags, tag]);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setMainImageFile(file);
        if (file) setMainImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setGalleryFiles(files);
        setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleDeleteGalleryImage = async (imgId: string) => {
        if (!confirm("Delete this gallery image?")) return;
        const { error } = await supabase.from('article_gallery').delete().eq('id', imgId);
        if (!error) {
            setExistingGallery(existingGallery.filter(img => img.id !== imgId));
        } else {
            alert("Failed to delete image: " + error.message);
        }
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
        const { error: updateError } = await supabase.from('articles').update({
            title: form.title, excerpt: form.excerpt, content: form.content,
            author: form.author || 'Admin', published: form.published,
            category: selectedTags[0] || 'News', tags: selectedTags
        }).eq('id', id);

        if (updateError) { alert("Failed to update: " + updateError.message); setSaving(false); return; }

        // 2. Upload New Main Image if selected
        if (mainImageFile) {
            const fileName = `${Date.now()}_main.${mainImageFile.name.split('.').pop()}`;
            const { error: uploadErr } = await supabase.storage.from('article-images').upload(fileName, mainImageFile);
            if (!uploadErr) {
                const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                await supabase.from('articles').update({ image_url: urlData.publicUrl }).eq('id', id);
            }
        }

        // 3. Upload New Gallery Images
        if (galleryFiles.length > 0) {
            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const fileName = `${Date.now()}_${i}.${file.name.split('.').pop()}`;
                const { error: gErr } = await supabase.storage.from('article-images').upload(fileName, file);
                if (!gErr) {
                    const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                    await supabase.from('article_gallery').insert({ article_id: id, image_url: urlData.publicUrl, is_main: false });
                }
            }
        }

        setSaving(false);
        alert("Story updated successfully!");
        router.push('/admin/dashboard');
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
                            value={form.content}
                            onChange={(newContent) => setForm({ ...form, content: newContent })}
                        />
                        <div className="h-12"></div>
                    </div>

                    {/* --- MAIN IMAGE EDITING --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Main Image</label>
                        <div className="flex items-center gap-4">
                            {mainImagePreview ? (
                                <img src={mainImagePreview} alt="Main" className="w-32 h-20 object-cover border rounded" />
                            ) : (
                                <div className="w-32 h-20 bg-gray-200 border rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                            )}
                            <input type="file" accept="image/*" onChange={handleMainImageChange} className="text-sm" />
                        </div>
                    </div>

                    {/* --- EXISTING GALLERY IMAGES --- */}
                    {existingGallery.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delete Gallery Images</label>
                            <div className="flex flex-wrap gap-3">
                                {existingGallery.map((img) => (
                                    <div key={img.id} className="relative group w-24 h-24 border rounded overflow-hidden">
                                        <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGalleryImage(img.id)}
                                            className="absolute inset-0 bg-red-600/80 text-white font-bold text-xl hidden group-hover:flex items-center justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ADD NEW GALLERY IMAGES --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add New Gallery Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleGalleryFilesChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" />
                        {galleryPreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {galleryPreviews.map((url, idx) => (
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