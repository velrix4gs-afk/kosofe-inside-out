"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', company: '', location: '', salary: '', description: '', contact_email: '', contact_phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('jobs').insert({
            ...form,
            is_active: true // Goes live immediately
        });

        setLoading(false);
        if (error) {
            alert("Error posting job: " + error.message);
        } else {
            alert("Job posted successfully!");
            router.push('/jobs');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Post a Job Opportunity</h1>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4">List a local job vacancy for the Kosofe community.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary / Compensation</label>
                            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                        <textarea rows={4} required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                            <input type="email" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                            <input type="tel" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 transition">
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}