"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OwnerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [claimedBiz, setClaimedBiz] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/owner/login');
                return;
            }
            setUserId(user.id);

            // Check if this user already claimed a business
            const { data } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('claimed_by', user.id)
                .single();

            setClaimedBiz(data);
            setLoading(false);
        };
        checkUser();
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

    if (claimedBiz) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Your Business Profile</h1>
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h3 className="font-bold text-xl text-gray-800">{claimedBiz.business_name}</h3>
                    <p className="text-sm text-gray-500">Category: {claimedBiz.category}</p>
                    <p className="text-sm text-gray-500 mt-1">Status: <span className="text-green-600 font-bold">Verified & Live</span></p>
                    <div className="mt-4 flex gap-4">
                        <Link href={`/owner/dashboard/edit/${claimedBiz.id}`} className="bg-[#c41e3a] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a0152e]">
                            Edit My Profile
                        </Link>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded font-bold text-sm hover:bg-gray-50">View Public Profile</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Owner Dashboard</h1>
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">You haven't claimed a business in the Kosofe Directory yet.</p>
                <Link href="/directory" className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold text-sm hover:bg-[#a0152e]">
                    Browse Directory to Claim
                </Link>
            </div>
        </div>
    );
}