"use client";
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can hook this form into Supabase or an email service later.
        // For now, we'll just show a success message.
        setSubmitted(true);
        console.log("Contact Form Submitted:", formData);
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
                        <p className="text-xs mt-1">We will get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><input type="text" placeholder="Your Name" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div><input type="email" placeholder="Your Email" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                        <div><textarea rows={4} placeholder="Your Message" required className="w-full border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]" onChange={(e) => setFormData({ ...formData, message: e.target.value })} /></div>
                        <button type="submit" className="w-full bg-[#c41e3a] text-white py-2 rounded font-bold hover:bg-[#a0152e]">Send Message</button>
                    </form>
                )}
            </div>
        </div>
    );
}