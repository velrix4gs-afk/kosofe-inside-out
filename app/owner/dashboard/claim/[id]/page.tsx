"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClaimBusiness({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [business, setBusiness] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/owner/login');
                return;
            }
            setUserId(user.id);

            const { data } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (data && data.claimed_by) {
                alert("This business has already been claimed!");
                router.push('/owner/dashboard');
                return;
            }
            setBusiness(data);
            setLoading(false);
        };
        fetchData();
    }, [params, router]);

    const handleClaim = async () => {
        if (!business || !userId) return;
        setClaiming(true);
        const { error } = await supabase
            .from('directory_entries')
            .update({ claimed_by: userId })
            .eq('id', business.id);

        setClaiming(false);
        if (error) alert("Error claiming business: " + error.message);
        else router.push('/owner/dashboard');
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Claim Your Business</h1>
                <p className="text-sm text-gray-600 mb-4">You are about to claim ownership of:</p>
                <h3 className="font-bold text-xl text-[#c41e3a] mb-4">{business?.business_name}</h3>
                <p className="text-xs text-gray-500 mb-4">Once claimed, you will be able to edit the name, address, phone, social links, and opening hours.</p>
                <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="bg-[#c41e3a] text-white px-6 py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50 w-full"
                >
                    {claiming ? 'Claiming...' : 'Yes, Claim This Business'}
                </button>
            </div>
        </div>
    );
}