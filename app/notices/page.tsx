import { supabase } from "@/lib/supabase";

export default async function NoticesPage() {
    const { data: notices, error } = await supabase
        .from('public_notices')
        .select('*')
        .order('date', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Public Notices & Announcements</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                    <p className="font-bold">Error loading notices</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            )}

            {!error && (!notices || notices.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No public notices yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Check back later for community announcements and government updates.</p>
                </div>
            )}

            {!error && notices && notices.length > 0 && (
                <div className="space-y-6">
                    {notices.map((notice) => (
                        <div key={notice.id} className="bg-white p-6 rounded shadow-sm border-l-4 border-[#c41e3a]">
                            <h4 className="font-bold text-lg text-gray-800">{notice.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 border-b pb-2 mb-2">
                                {new Date(notice.date || notice.created_at).toLocaleDateString()}
                                {notice.source && <span className="font-bold text-gray-700 ml-2"> • Source: {notice.source}</span>}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}