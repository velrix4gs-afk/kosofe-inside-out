"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContributorsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState<any[]>([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/admin/login"); return; }

            const { data } = await supabase
                .from("contributors")
                .select("*")
                .order("created_at", { ascending: false });

            setApplicants(data || []);
            setLoading(false);
        };
        fetchApplicants();
    }, [router]);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from("contributors").update({ status: newStatus }).eq("id", id);
        setApplicants(applicants.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    // DELETE FUNCTION
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete application from ${name}? This cannot be undone.`)) return;
        const { error } = await supabase.from("contributors").delete().eq("id", id);
        if (error) {
            alert("Failed to delete: " + error.message);
        } else {
            setApplicants(applicants.filter(a => a.id !== id));
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading applicants...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/admin/dashboard" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Contributor Applications</h1>
            </div>

            {applicants.length === 0 ? (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <p className="text-gray-500">No applications yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map(app => (
                        <div key={app.id} className="bg-white p-5 rounded shadow-sm border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b pb-3 mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{app.full_name} {app.byline && <span className="text-sm text-gray-500">({app.byline})</span>}</h3>
                                    <p className="text-xs text-gray-500">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                        className={`text-xs font-bold px-2 py-1 rounded border ${app.status === 'approved' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="contacted">Contacted</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(app.id, app.full_name)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <p><span className="font-bold text-gray-600">WhatsApp:</span> <a href={`https://wa.me/${app.whatsapp}`} target="_blank" className="text-green-600 underline">{app.whatsapp}</a></p>
                                <p><span className="font-bold text-gray-600">Email:</span> <a href={`mailto:${app.email}`} className="text-[#c41e3a] underline">{app.email}</a></p>
                                <p><span className="font-bold text-gray-600">Neighbourhood:</span> {app.neighbourhood || '—'}</p>
                                <p><span className="font-bold text-gray-600">Coverage Areas:</span> {app.coverage_areas || '—'}</p>
                                <p className="md:col-span-2"><span className="font-bold text-gray-600">Kosofe Connection:</span> {app.kosofe_connection || '—'}</p>
                                <p className="md:col-span-2"><span className="font-bold text-gray-600">Interests:</span> {app.interests || '—'}</p>
                                <p className="md:col-span-2"><span className="font-bold text-gray-600">Experience:</span> {app.experience || '—'}</p>
                                <p className="md:col-span-2"><span className="font-bold text-gray-600">Samples:</span> {app.samples || '—'}</p>
                                <p><span className="font-bold text-gray-600">Availability:</span> {app.availability || '—'}</p>
                                <p><span className="font-bold text-gray-600">Equipment:</span> {app.equipment || '—'}</p>
                                <p><span className="font-bold text-gray-600">Affiliations:</span> {app.affiliations || '—'}</p>
                                <p><span className="font-bold text-gray-600">Reference:</span> {app.reference || '—'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}