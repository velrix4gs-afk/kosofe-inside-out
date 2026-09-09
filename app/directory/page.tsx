import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import DirectoryFilters from "@/components/DirectoryFilters";

export default async function DirectoryPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string; location?: string }>
}) {
    const { q, category, location } = await searchParams;

    let query = supabase
        .from('directory_entries')
        .select('*')
        .eq('approved', true);

    // If search box has text, search across Name, Category, Description, AND Address
    if (q) {
        query = query.or(`business_name.ilike.%${q}%,category.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%`);
    }

    if (category) query = query.eq('category', category);
    if (location) query = query.eq('address', location);

    query = query.order('is_premium', { ascending: false }).order('business_name', { ascending: true });

    const { data: businesses, error } = await query;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Local Business Directory</h1>
                <Link href="/directory/submit" className="mt-2 sm:mt-0 bg-[#c41e3a] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a0152e] transition">
                    + List Your Business
                </Link>
            </div>

            {/* Smart Filter Component */}
            <DirectoryFilters />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                    <p className="font-bold">Error loading directory</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            )}

            {!error && (!businesses || businesses.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No businesses found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try a different keyword or location.</p>
                </div>
            )}

            {!error && businesses && businesses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((biz) => (
                        <Link key={biz.id} href={`/directory/${biz.id}`} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden relative flex flex-col hover:shadow-md transition">
                            <div className="relative h-32 bg-gray-200">
                                {biz.cover_photo && (
                                    <Image src={biz.cover_photo} alt={biz.business_name} fill className="object-cover" unoptimized />
                                )}
                                {biz.is_premium && (
                                    <span className="absolute top-2 right-2 bg-[#c41e3a] text-white text-[10px] font-bold uppercase px-2 py-1 rounded">PREMIUM</span>
                                )}
                            </div>

                            <div className="flex items-start gap-4 p-4 pt-0 -mt-6 relative z-10">
                                <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                    {biz.logo_url ? (
                                        <Image src={biz.logo_url} alt={biz.business_name} width={56} height={56} className="object-cover" unoptimized />
                                    ) : (
                                        <span className="text-xs font-bold text-gray-400">Logo</span>
                                    )}
                                </div>
                                <div className="flex-1 pt-6">
                                    <h4 className="font-bold text-lg text-gray-800 leading-tight">{biz.business_name}</h4>
                                    {biz.category && <span className="text-[10px] font-bold text-[#c41e3a] uppercase">{biz.category}</span>}
                                    {biz.address && <span className="block text-[10px] text-gray-500">{biz.address}</span>}
                                    {biz.verified_level > 0 && (
                                        <span className="inline-block bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                                            ✓ Verified Level {biz.verified_level}
                                        </span>
                                    )}
                                    {biz.is_open_now && (
                                        <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 ml-1">
                                            Open Now
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-4 pb-4 space-y-2">
                                {biz.description && <p className="text-sm text-gray-600 line-clamp-2">{biz.description}</p>}
                                {biz.phone && <p className="text-xs text-gray-500">📞 {biz.phone}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}