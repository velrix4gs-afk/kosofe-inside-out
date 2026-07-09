"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { approveBusiness, rejectBusiness } from "./actions";

export default function AdminDirectoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState<any[]>([]);
    const [approved, setApproved] = useState<any[]>([]);

    useEffect(() => {
        const checkUserAndFetch = async () => {
            // 1. Check session client-side (this bypasses the server cookie bug)
            const { data: { user } } = await supabase.auth.getUser();

            // If not logged in, push back to login
            if (!user) {
                router.push('/admin/login');
                return;
            }

            // 2. Fetch pending and approved businesses
            const { data: pendingData } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('approved', false);
            setPending(pendingData || []);

            const { data: approvedData } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false });
            setApproved(approvedData || []);

            setLoading(false);
        };

        checkUserAndFetch();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center font-bold text-gray-500">Loading Directory Panel...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Directory</h1>
                    <Link href="/admin/dashboard" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back to Stories</Link>
                </div>

                {/* PENDING APPROVALS SECTION */}
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-orange-600 mb-4">Pending Approvals ({pending?.length || 0})</h2>
                    {(!pending || pending.length === 0) ? (
                        <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200">No businesses waiting for approval.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {pending.map((biz) => (
                                <div key={biz.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{biz.business_name}</h4>
                                        <p className="text-sm text-gray-600">{biz.category} • {biz.phone}</p>
                                        {biz.email && <p className="text-xs text-gray-500">{biz.email}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={approveBusiness.bind(null, biz.id)}>
                                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 transition">Approve</button>
                                        </form>
                                        <form action={rejectBusiness.bind(null, biz.id)}>
                                            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition">Reject</button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* APPROVED / ACTIVE SECTION */}
                <div>
                    <h2 className="text-lg font-bold text-green-600 mb-4">Active Listings ({approved?.length || 0})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {approved?.map((biz) => (
                            <div key={biz.id} className="bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800">{biz.business_name}</h4>
                                    <p className="text-xs text-gray-500">{biz.category} • {biz.phone}</p>
                                </div>
                                {biz.is_premium && (
                                    <span className="bg-[#c41e3a] text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Premium</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}