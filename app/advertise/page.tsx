"use client";
import Link from "next/link";
import { useState } from 'react';

export default function AdvertisePage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', plan: 'Standard' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        console.log("Ad Enquiry:", formData);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* HERO */}
            <div className="text-center mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Advertise With Kosofe Inside Out</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Reach thousands of engaged local residents and businesses in Kosofe. Put your brand in front of the people who matter most.</p>
            </div>

            {/* AD RATES */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Ad Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { name: 'Standard', price: '₦30,000/mo', desc: 'Display banner ad on the homepage for 30 days. Reach up to 5,000 views.', bg: 'bg-white' },
                    { name: 'Premium', price: '₦75,000/mo', desc: 'Premium placement in the Hero section + social media shoutout.', bg: 'bg-[#f9f9f9] border-2 border-[#c41e3a]' },
                    { name: 'Sponsored Post', price: '₦50,000/post', desc: 'We write and publish a full feature article about your business or event.', bg: 'bg-white' }
                ].map((plan, idx) => (
                    <div key={idx} className={`${plan.bg} p-6 rounded shadow-sm text-center border hover:shadow-md transition`}>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                        <p className="text-2xl font-bold text-[#c41e3a] mb-3">{plan.price}</p>
                        <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                        <button onClick={() => setFormData({ ...formData, plan: plan.name })} className="border border-[#c41e3a] text-[#c41e3a] px-6 py-2 rounded text-sm font-bold hover:bg-[#c41e3a] hover:text-white transition block w-full">
                            Choose {plan.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* ENQUIRY FORM */}
            <div className="bg-white p-8 rounded shadow-sm max-w-2xl mx-auto">
                <h3 className="font-bold text-xl text-center mb-4">Book Your Ad Spot or Request a Custom Quote</h3>
                {submitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded text-center">
                        <p className="font-bold">Enquiry Sent!</p>
                        <p className="text-xs mt-1">Our advertising team will contact you within 24 hours to finalize your package.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Business Name" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <input type="email" placeholder="Business Email" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <input type="tel" placeholder="Phone Number" required className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Which package are you interested in?</label>
                            <select className="w-full border p-2 rounded" value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                                <option>Standard</option>
                                <option>Premium</option>
                                <option>Sponsored Post</option>
                                <option>Custom Quote</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-[#c41e3a] text-white py-2 rounded font-bold hover:bg-[#a0152e]">Send Enquiry</button>
                    </form>
                )}
            </div>
        </div>
    );
}