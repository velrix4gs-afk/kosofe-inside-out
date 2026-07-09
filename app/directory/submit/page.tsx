"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitDirectoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        business_name: '', category: '', phone: '', email: '', address: '', website: '', whatsapp: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let logoUrl = '';
        let coverUrl = '';

        // 1. Upload Logo if selected
        if (logoFile) {
            const fileExt = logoFile.name.split('.').pop();
            const fileName = `logo_${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage.from('directory-images').upload(fileName, logoFile);
            if (!error) {
                const { data } = supabase.storage.from('directory-images').getPublicUrl(fileName);
                logoUrl = data.publicUrl;
            }
        }

        // 2. Upload Cover Photo if selected
        if (coverFile) {
            const fileExt = coverFile.name.split('.').pop();
            const fileName = `cover_${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage.from('directory-images').upload(fileName, coverFile);
            if (!error) {
                const { data } = supabase.storage.from('directory-images').getPublicUrl(fileName);
                coverUrl = data.publicUrl;
            }
        }

        // 3. Insert with approved = false
        const { error } = await supabase.from('directory_entries').insert({
            ...form,
            logo_url: logoUrl,
            cover_photo: coverUrl,
            approved: false,
            verified_level: 0,
            is_premium: false
        });

        setLoading(false);
        if (error) {
            alert("Error submitting business: " + error.message);
        } else {
            alert("Business submitted for approval! We'll review your listing soon.");
            router.push('/directory');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">List Your Business</h1>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4">Submit your business for free to the Kosofe Inside Out Directory.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option value="">Select a category</option>
                            <option>Food & Restaurants</option>
                            <option>Shopping</option>
                            <option>Healthcare</option>
                            <option>Education</option>
                            <option>Automotive</option>
                            <option>Professional Services</option>
                            <option>Home Services</option>
                            <option>Beauty</option>
                            <option>Hospitality</option>
                            <option>Real Estate</option>
                            <option>Technology</option>
                            <option>Financial Services</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input type="tel" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website / Social Media Link</label>
                        <input type="url" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                    </div>

                    {/* New Image Upload Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
                        <input type="file" accept="image/*" className="w-full border p-1.5 rounded" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo (Banner Image)</label>
                        <input type="file" accept="image/*" className="w-full border p-1.5 rounded" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 transition">
                        {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}