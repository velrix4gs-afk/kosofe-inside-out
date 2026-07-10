"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Predefined list of available tags for Kosofe
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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enforce "at least 5 tags" rule
    if (selectedTags.length < 5) {
      alert("Please select at least 5 category tags for this story.");
      return;
    }

    setLoading(true);
    let mainImageUrl = '';
    const galleryUrls: string[] = [];

    // ... [Image upload logic remains exactly the same] ...
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

    // Insert with the new tags array
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: selectedTags[0] || 'News', // The main category = the first selected tag
        image_url: mainImageUrl,
        published: form.published,
        author: form.author || 'Admin',
        tags: selectedTags // Storing the whole array here!
      })
      .select()
      .single();

    if (articleError) { alert("Failed to save story: " + articleError.message); setLoading(false); return; }

    // [Gallery logic remains exactly the same]
    if (galleryUrls.length > 1) {
      const galleryInserts = galleryUrls.slice(1).map(url => ({
        article_id: articleData.id, image_url: url, is_main: false
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
            <input type="text" required className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" placeholder="e.g. John Doe" className="w-full border p-2 rounded" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
          </div>

          {/* --- MULTI-TAG SELECTOR UI --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Category Tags (Choose at least 5)</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                      isSelected 
                        ? 'bg-[#c41e3a] text-white border-[#c41e3a]' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#c41e3a] hover:text-[#c41e3a]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">Selected: {selectedTags.length} / 5 required minimum</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Select multiple)</label>
              <input type="file" multiple accept="image/*" className="w-full border p-1.5 rounded" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt (Summary)</label>
            <textarea rows={2} className="w-full border p-2 rounded" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
            <textarea rows={8} required className="w-full border p-2 rounded" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
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