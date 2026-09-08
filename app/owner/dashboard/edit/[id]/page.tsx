"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditBusiness({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        business_name: '', category: '', phone: '', address: '', website: '', whatsapp: '', description: '', opening_hours: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/owner/login'); return; }

            const { data } = await supabase.from('directory_entries').select('*').eq('id', resolvedParams.id).single();
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
        else { alert("Business updated!"); router.push('/owner/dashboard'); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading form...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-sm">
                <h1 className="text-2xl font-bold mb-4 border-b pb-2">Edit Your Business</h1>
                <form onSubmit={handleUpdate} className="space-y-3">
                    <div><label className="block text-sm font-medium mb-1">Business Name</label><input type="text" required className="w-full border p-2 rounded" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-1">Category</label><select className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Real Estate</option><option>Food Services</option><option>Security Services</option><option>Other</option></select></div>
                    <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" required className="w-full border p-2 rounded" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-1">Address</label><input type="text" className="w-full border p-2 rounded" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-1">Opening Hours</label><input type="text" placeholder="9AM - 6PM" className="w-full border p-2 rounded" value={form.opening_hours} onChange={e => setForm({ ...form, opening_hours: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={3} className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <button type="submit" disabled={saving} className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold">{saving ? 'Saving...' : 'Save'}</button>
                </form>
            </div>
        </div>
    );
}/