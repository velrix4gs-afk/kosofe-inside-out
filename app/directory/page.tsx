import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function DirectoryPage() {
    // Fetch only approved businesses
    const { data: businesses, error } = await supabase
        .from('directory_entries')
        .select('*')
        .eq('approved', true)
        .order('is_premium', { ascending: false }) // Premium shows up top!
        .order('name', { ascending: true }); // Then alphabetical

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Local Business Directory</h1>
                <Link href="/directory/submit" className="mt-2 sm:mt-0 bg-[#c41e3a] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a0152e] transition">
                    + List Your Business
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                    <p className="font-bold">Error loading directory</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            )}

            {!error && (!businesses || businesses.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No businesses listed yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Be the first to add your business to our directory!</p>
                </div>
            )}

            {!error && businesses && businesses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((biz) => (
                        <div key={biz.id} className={`bg-white p-6 rounded shadow-sm border border-gray-200 relative ${biz.is_premium ? 'border-l-4 border-[#c41e3a]' : ''}`}>
                            {biz.is_premium && (
                                <span className="absolute top-0 right-0 bg-[#c41e3a] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-bl">PREMIUM</span>
                            )}
                            <h4 className="font-bold text-lg text-gray-800 mb-1">{biz.name}</h4>
                            {biz.category && <span className="text-xs font-bold text-[#c41e3a] uppercase mb-2 inline-block">{biz.category}</span>}
                            {biz.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{biz.description}</p>}
                            <div className="space-y-1 text-xs text-gray-500">
                                {biz.phone && <p>📞 {biz.phone}</p>}
                                {biz.address && <p>📍 {biz.address}</p>}
                                {biz.email && <p>✉️ {biz.email}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}