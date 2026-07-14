"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBusiness({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        business_name: '', category: '', phone: '', address: '', website: '', whatsapp: '', description: '', opening_hours: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/owner/login'); return; }

            const { data } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (!data || data.claimed_by !== user.id) {
                router.push('/owner/dashboard');
                return;
            }
            setForm(data);
            setLoading(false);
        };
        fetchData();
    }, [params, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.from('directory_entries').update(form).eq('id', form.id);
        setSaving(false);
        if (error) alert("Update failed: " + error.message);
        else { alert("Business updated successfully!"); router.push('/owner/dashboard'); }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading form...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Edit Your Business</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input type="text" required className="w-full border p-2 rounded" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Food & Restaurants</option><option>Shopping</option><option>Healthcare</option><option>Education</option><option>Home Services</option><option>Beauty</option><option>Automotive</option><option>Professional Services</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" required className="w-full border p-2 rounded" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" className="w-full border p-2 rounded" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input type="url" className="w-full border p-2 rounded" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input type="text" className="w-full border p-2 rounded" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label><input type="text" placeholder="e.g. 9AM - 6PM" className="w-full border p-2 rounded" value={form.opening_hours} onChange={e => setForm({ ...form, opening_hours: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><textarea rows={3} className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">{saving ? 'Saving...' : 'Update Profile'}</button>
                        <button type="button" onClick={() => router.push('/owner/dashboard')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}