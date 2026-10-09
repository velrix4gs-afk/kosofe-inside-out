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

// Helper: Extract the storage path from a full Supabase URL so we can delete it
const getStoragePath = (url: string) => {
    if (!url) return null;
    const parts = url.split('/article-images/');
    return parts.length > 1 ? parts[1] : null;
};

export default function EditStory({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', author: '', published: false
    });
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // MAIN IMAGE
    const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

    // GALLERY
    const [existingGallery, setExistingGallery] = useState<any[]>([]);
    const [galleryEdits, setGalleryEdits] = useState<{ [key: string]: File }>({});
    const [galleryPreviews, setGalleryPreviews] = useState<{ [key: string]: string }>({});
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

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
                setCurrentMainImage(articleData.image_url || null);
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

    // MAIN IMAGE handlers
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setMainImageFile(file);
        if (file) setMainImagePreview(URL.createObjectURL(file));
    };

    const handleDeleteMainImage = async () => {
        if (!confirm("Remove the main image from this story?")) return;
        // Optional: delete from storage
        const path = getStoragePath(currentMainImage || '');
        if (path) await supabase.storage.from('article-images').remove([path]);
        // Update database to remove URL
        await supabase.from('articles').update({ image_url: null }).eq('id', id);
        setCurrentMainImage(null);
        setMainImagePreview(null);
        setMainImageFile(null);
    };

    // EXISTING GALLERY handlers
    const handleReplaceGallery = (galleryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;
        setGalleryEdits(prev => ({ ...prev, [galleryId]: file }));
        setGalleryPreviews(prev => ({ ...prev, [galleryId]: URL.createObjectURL(file) }));
    };

    const handleDeleteGalleryImage = async (imgId: string, imgUrl: string) => {
        if (!confirm("Delete this gallery image permanently?")) return;
        // Delete from storage
        const path = getStoragePath(imgUrl);
        if (path) await supabase.storage.from('article-images').remove([path]);
        // Delete from database
        const { error } = await supabase.from('article_gallery').delete().eq('id', imgId);
        if (error) {
            alert("Failed to delete: " + error.message);
        } else {
            setExistingGallery(existingGallery.filter(img => img.id !== imgId));
        }
    };

    // NEW GALLERY handlers
    const handleNewGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewGalleryFiles(files);
        setNewGalleryPreviews(files.map(file => URL.createObjectURL(file)));
    };

    // SAVE
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTags.length < 2) {
            alert("Please select at least 2 category tags.");
            return;
        }
        setSaving(true);
        if (!id) return;

        // 1. UPDATE THE MAIN IMAGE (if changed)
        let mainImageUrl = currentMainImage;
        if (mainImageFile) {
            // Delete old image
            const oldPath = getStoragePath(currentMainImage || '');
            if (oldPath) await supabase.storage.from('article-images').remove([oldPath]);

            // Upload new
            const fileName = `${Date.now()}_main.${mainImageFile.name.split('.').pop()}`;
            const { error: uploadErr } = await supabase.storage.from('article-images').upload(fileName, mainImageFile);
            if (uploadErr) { alert("Main image upload failed: " + uploadErr.message); setSaving(false); return; }
            const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
            mainImageUrl = urlData.publicUrl;
        }

        // 2. UPDATE THE ARTICLE
        const { error: updateError } = await supabase.from('articles').update({
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            author: form.author || 'Admin',
            published: form.published,
            category: selectedTags[0] || 'News',
            tags: selectedTags,
            image_url: mainImageUrl
        }).eq('id', id);

        if (updateError) { alert("Failed to update: " + updateError.message); setSaving(false); return; }

        // 3. REPLACE EXISTING GALLERY IMAGES
        for (const [galleryId, file] of Object.entries(galleryEdits)) {
            const oldImg = existingGallery.find(g => String(g.id) === galleryId);
            // Delete old from storage
            const oldPath = getStoragePath(oldImg?.image_url || '');
            if (oldPath) await supabase.storage.from('article-images').remove([oldPath]);

            // Upload new
            const fileName = `${Date.now()}_${galleryId}.${file.name.split('.').pop()}`;
            const { error: uploadErr } = await supabase.storage.from('article-images').upload(fileName, file);
            if (!uploadErr) {
                const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
                await supabase.from('article_gallery').update({ image_url: urlData.publicUrl }).eq('id', galleryId);
            }
        }

        // 4. ADD NEW GALLERY IMAGES
        if (newGalleryFiles.length > 0) {
            for (let i = 0; i < newGalleryFiles.length; i++) {
                const file = newGalleryFiles[i];
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

    if (loading) return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center font-bold text-gray-500">Loading story...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Story</h1>
                <form onSubmit={handleUpdate} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                        <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input type="text" className="w-full border p-2 rounded" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Tags (min 2)</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${isSelected ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#c41e3a]'}`}>
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
                        <textarea rows={2} className="w-full border p-2 rounded" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                        <RichTextEditor value={form.content} onChange={(newContent) => setForm({ ...form, content: newContent })} />
                        <div className="h-12"></div>
                    </div>

                    {/* --- MAIN IMAGE MANAGEMENT --- */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Main Image</label>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {mainImagePreview ? (
                                <img src={mainImagePreview} alt="Main" className="w-40 h-28 object-cover border rounded" />
                            ) : (
                                <div className="w-40 h-28 bg-gray-200 border rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                            )}
                            <div className="flex flex-col gap-2">
                                <label className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded cursor-pointer hover:bg-blue-700 w-fit">
                                    Replace Main Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
                                </label>
                                {mainImagePreview && (
                                    <button type="button" onClick={handleDeleteMainImage} className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded hover:bg-red-700 w-fit">
                                        Delete Main Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- EXISTING GALLERY MANAGEMENT --- */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Existing Gallery Images ({existingGallery.length})</label>
                        {existingGallery.length === 0 ? (
                            <p className="text-xs text-gray-500">No gallery images yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {existingGallery.map((img) => {
                                    const replacement = galleryEdits[img.id];
                                    const previewUrl = galleryPreviews[img.id] || img.image_url;
                                    return (
                                        <div key={img.id} className="relative border rounded overflow-hidden bg-gray-100">
                                            <img src={previewUrl} alt="Gallery" className="w-full h-28 object-cover" />
                                            {replacement && (
                                                <span className="absolute top-1 left-1 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                    REPLACING
                                                </span>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 flex">
                                                <label className="flex-1 bg-blue-600 text-white text-[10px] font-bold py-1 text-center cursor-pointer hover:bg-blue-700">
                                                    Replace
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplaceGallery(img.id, e)} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGalleryImage(img.id, img.image_url)}
                                                    className="flex-1 bg-red-600 text-white text-[10px] font-bold py-1 text-center hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* --- ADD NEW GALLERY IMAGES --- */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Add New Gallery Images</label>
                        <input type="file" multiple accept="image/*" className="w-full border p-2 rounded" onChange={handleNewGalleryFilesChange} />
                        {newGalleryPreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {newGalleryPreviews.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden border">
                                        <img src={url} alt={`New ${idx}`} className="w-full h-full object-cover" />
                                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                            Published
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 ml-auto">
                            <button type="button" onClick={() => router.push('/admin/dashboard')} className="bg-gray-200 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white py-2 px-6 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}