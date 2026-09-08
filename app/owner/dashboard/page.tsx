"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [biz, setBiz] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/owner/login');
                return;
            }

            const { data } = await supabase
                .from('directory_entries')
                .select('*')
                .eq('claimed_by', user.id)
                .single();

            setBiz(data);
            setLoading(false);
        };
        checkUser();
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

    if (!biz) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded shadow-sm text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Owner!</h1>
                    <p className="text-gray-500 mb-4">You haven't claimed a business yet. Browse the directory to find your listing.</p>
                    <Link href="/directory" className="bg-[#c41e3a] text-white px-6 py-2 rounded font-bold">Browse Directory</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{biz.business_name}</h1>
                            <p className="text-sm text-gray-500">{biz.category}</p>
                        </div>
                        <Link href={`/owner/dashboard/edit/${biz.id}`} className="bg-[#c41e3a] text-white px-4 py-2 rounded text-sm font-bold">Edit Profile</Link>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                        {biz.address && <p className="text-sm"><span className="font-semibold">Address:</span> {biz.address}</p>}
                        {biz.phone && <p className="text-sm"><span className="font-semibold">Phone:</span> {biz.phone}</p>}
                        {biz.opening_hours && <p className="text-sm"><span className="font-semibold">Hours:</span> {biz.opening_hours}</p>}
                        {biz.description && <p className="text-sm text-gray-600">{biz.description}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}