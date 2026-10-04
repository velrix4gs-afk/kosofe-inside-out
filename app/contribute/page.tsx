"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const INTEREST_OPTIONS = [
    "News", "Markets", "Politics", "Community", "Business",
    "Education", "Sports", "Culture"
];

export default function ContributePage() {
    const [form, setForm] = useState({
        full_name: "", byline: "", whatsapp: "", email: "",
        neighbourhood: "", coverage_areas: "", kosofe_connection: "",
        experience: "", samples: "", availability: "",
        equipment: "", affiliations: "", reference: ""
    });
    const [interests, setInterests] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (interests.length === 0) {
            alert("Please select at least one reporting interest.");
            return;
        }
        setStatus("loading");

        const { error } = await supabase.from("contributors").insert({
            ...form,
            interests: interests.join(", "),
        });

        if (error) {
            setStatus("error");
        } else {
            setStatus("success");
        }
    };

    if (status === "success") {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-10 rounded shadow-sm border border-gray-200">
                    <p className="text-5xl mb-4">🎉</p>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Received!</h1>
                    <p className="text-gray-600 text-sm">Thank you for applying to contribute to Kosofe Inside Out. We'll review your details and reach out via WhatsApp or email within 3-5 working days.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-[#c41e3a] to-[#a0152e] text-white rounded-lg p-6 md:p-8 mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold">📢 Report a Story & Earn</h1>
                <p className="text-sm md:text-base mt-2 opacity-90">
                    Earn as much as <span className="font-bold text-yellow-300">₦25,000</span> for a story in your community.
                </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* IDENTITY */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Identity & Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name *</label>
                                <input type="text" required className="w-full border p-2 rounded" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Preferred Byline</label>
                                <input type="text" className="w-full border p-2 rounded" value={form.byline} onChange={e => setForm({ ...form, byline: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp Number *</label>
                                <input type="tel" required className="w-full border p-2 rounded" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input type="email" required className="w-full border p-2 rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Location & Coverage</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Neighbourhood</label>
                                <input type="text" placeholder="e.g. Ketu, Magodo, Ojota" className="w-full border p-2 rounded" value={form.neighbourhood} onChange={e => setForm({ ...form, neighbourhood: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Areas You Can Cover</label>
                                <input type="text" className="w-full border p-2 rounded" value={form.coverage_areas} onChange={e => setForm({ ...form, coverage_areas: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Connection to Kosofe</label>
                                <textarea rows={2} className="w-full border p-2 rounded" value={form.kosofe_connection} onChange={e => setForm({ ...form, kosofe_connection: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* INTERESTS */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Reporting Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map(interest => {
                                const isSelected = interests.includes(interest);
                                return (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-3 py-1.5 rounded text-xs font-bold transition border ${isSelected ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#c41e3a]'}`}
                                    >
                                        {interest}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* EXPERIENCE */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Experience</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Brief Background</label>
                                <textarea rows={3} className="w-full border p-2 rounded" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Samples (2-3 links to writing, photography, or video)</label>
                                <textarea rows={3} placeholder="Paste links here..." className="w-full border p-2 rounded" value={form.samples} onChange={e => setForm({ ...form, samples: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* AVAILABILITY */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Availability & Equipment</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Days Available & Turnaround Time</label>
                                <input type="text" placeholder="e.g. Weekends, 24-hour turnaround" className="w-full border p-2 rounded" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Equipment You Have</label>
                                <input type="text" placeholder="e.g. Smartphone, Camera, Audio Recorder" className="w-full border p-2 rounded" value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* AFFILIATIONS & REFERENCE */}
                    <div>
                        <h3 className="font-bold text-[#c41e3a] uppercase text-xs mb-3 border-b pb-2">Other Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Other Affiliations</label>
                                <input type="text" placeholder="Other media, political, government, or business roles" className="w-full border p-2 rounded" value={form.affiliations} onChange={e => setForm({ ...form, affiliations: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reference (Editor, Employer, or Community Contact)</label>
                                <input type="text" className="w-full border p-2 rounded" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 transition"
                    >
                        {status === "loading" ? "Submitting..." : "Submit Application"}
                    </button>

                    {status === "error" && (
                        <p className="text-red-600 text-xs text-center">Something went wrong. Please try again.</p>
                    )}
                </form>
            </div>
        </div>
    );
}