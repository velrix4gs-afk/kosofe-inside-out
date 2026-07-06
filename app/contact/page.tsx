"use client";
import { useState } from 'react';
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Insert into Supabase
        const { error } = await supabase.from('inquiries').insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            type: 'contact'
        });

        setLoading(false);
        if (error) {
            alert("Error sending message: " + error.message);
        } else {
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Contact Us</h1>
                <div className="space-y-4 text-sm text-gray-600">
                    <p className="font-bold text-gray-800">We'd love to hear from you!</p>
                    <p><span className="font-semibold text-gray-800">Address:</span> 1, Kosofe Road, Ketu, Lagos State, Nigeria.</p>
                    <p><span className="font-semibold text-gray-800">Email:</span> <span className="text-[#c41e3a]">info@kosofeinsideout.com</span></p>
                    <p><span className="font-semibold text-gray-800">Phone:</span> +234 800 123 4567</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
                <h3 className="font-bold text-lg mb-4">Send us a message</h3>
                {submitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded text-center">
                        <p className="font-bold">Message sent!</p>
                        <p className="text-xs mt-1">We'll get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Your Name" required className="w-full border p-2 rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input type="email" placeholder="Your Email" required className="w-full border p-2 rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <input type="tel" placeholder="Your Phone Number" className="w-full border p-2 rounded" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <textarea rows={4} placeholder="Your Message" required className="w-full border p-2 rounded" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                        <button type="submit" disabled={loading} className="w-full bg-[#c41e3a] text-white py-2 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}