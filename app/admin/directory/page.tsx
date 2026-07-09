"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);

    useEffect(() => {
        const checkUserAndFetch = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin/login');
                return;
            }

            const { data } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            setArticles(data || []);
            setLoading(false);
        };

        checkUserAndFetch();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen bg-[#f5f5f5] flex justify-center items-center">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow-sm">

                {/* --- UPDATED HEADER WITH NEW BUTTON --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Stories</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/directory" className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 transition flex items-center gap-1">
                            📂 Manage Directory
                        </Link>
                        <Link href="/admin/dashboard/create" className="bg-[#c41e3a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#a0152e]">+ Write New Story</Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-bold">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium max-w-[200px] truncate">{article.title}</td>
                                    <td className="p-3">{article.category}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {article.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500">{new Date(article.created_at).toLocaleDateString()}</td>
                                    <td className="p-3 flex gap-2">
                                        <button className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}