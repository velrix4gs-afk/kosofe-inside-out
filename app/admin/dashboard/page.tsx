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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const checkUserAndFetch = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/admin/login'); return; }

            const { data: storyData } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

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

    const openDeleteModal = (id: string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', deleteId);

        if (error) {
            alert('Failed to delete: ' + error.message);
        } else {
            setArticles(articles.filter(a => a.id !== deleteId));
            alert('Story deleted successfully!');
        }
        closeDeleteModal();
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading Command Center...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Admin Command Center</h1>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/admin/dashboard/create" className="bg-[#c41e3a] hover:bg-[#a0152e] text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">✍️</span>
                    <span className="font-bold text-lg">Write New Story</span>
                </Link>
                <Link href="/admin/directory" className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded shadow-sm flex flex-col items-center justify-center transition">
                    <span className="text-4xl mb-2">📂</span>
                    <span className="font-bold text-lg">Manage Directory</span>
                </Link>
            </div>

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
                                        <button onClick={() => openDeleteModal(article.id)} className="text-red-600 hover:underline text-xs font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Story?</h2>
                        <p className="text-sm text-gray-600 mb-4">This action cannot be undone. Are you sure you want to delete this story?</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={closeDeleteModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-300">Cancel</button>
                            <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}