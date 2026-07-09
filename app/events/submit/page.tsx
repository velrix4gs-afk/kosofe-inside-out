"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', date: '', time: '', location: '', description: '', organizer: '', image_url: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('events').insert(form);

        setLoading(false);
        if (error) {
            alert("Error submitting event: " + error.message);
        } else {
            alert("Event submitted successfully!");
            router.push('/events');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Submit a Community Event</h1>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4">List your local event for the Kosofe community to see.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                            <input type="date" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                            <input type="time" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                        <input type="text" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
                        <textarea rows={4} required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                            <input type="url" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 transition">
                        {loading ? 'Submitting...' : 'Submit Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}