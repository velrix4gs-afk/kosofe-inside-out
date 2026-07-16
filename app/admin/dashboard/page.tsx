"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, directory: 0 });

    useEffect(() => {
        const checkUserAndFetch = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/admin/login'); return; }

            // Fetch stories
            const { data: storyData } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch directory count
            const { count: dirCount } = await supabase
                .from('directory_entries')
                .select('*', { count: 'exact', head: true })
                .eq('approved', true);

            setArticles(storyData || []);
            setStats({
                total: storyData?.length || 0,
                published: storyData?.filter((a: any) => a.published).length || 0,
                draft: storyData?.filter((a: any) => !a.published).length || 0,
                directory: dirCount || 0
            });
            setLoading(false);
        };

        checkUserAndFetch();
    }, [router]);

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading Command Center...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Admin Command Center</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-[#c41e3a]">{stats.total}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Stories</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Published</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Drafts</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.directory}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Active Directory</p>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/admin/dashboard/create" className="bg-[#c41e3a] hover:bg-[#a0152e] text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">✍️</span>
                    <span className="font-bold text-lg">Write New Story</span>
                    <span className="text-xs opacity-90">Create & publish content instantly</span>
                </Link>
                <Link href="/admin/directory" className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">📂</span>
                    <span className="font-bold text-lg">Manage Directory</span>
                    <span className="text-xs opacity-90">Approve, edit, or reject business listings</span>
                </Link>
                <Link href="/admin/dashboard/breaking" className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">📢</span>
                    <span className="font-bold text-lg">Breaking News</span>
                    <span className="text-xs opacity-90">Post real-time alerts to the homepage</span>
                </Link>
                <Link href="/" className="bg-green-600 hover:bg-green-700 text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">👁️</span>
                    <span className="font-bold text-lg">View Live Site</span>
                    <span className="text-xs opacity-90">See your site exactly as readers see it</span>
                </Link>
            </div>

            {/* Recent Stories Table */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="font-bold text-gray-800">Recent Stories</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-bold">
                            <tr><th className="p-2">Title</th><th className="p-2 hidden sm:table-cell">Status</th><th className="p-2 hidden sm:table-cell">Date</th><th className="p-2">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {articles.slice(0, 10).map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="p-2 font-medium max-w-[120px] truncate">{article.title}</td>
                                    <td className="p-2 hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {article.published ? 'Live' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-gray-500 hidden sm:table-cell">{new Date(article.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 flex gap-2">
                                        <Link href={`/admin/dashboard/edit/${article.id}`} className="text-blue-600 hover:underline text-xs font-bold">Edit</Link>
                                        <button className="text-red-600 hover:underline text-xs font-bold">Delete</button>
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