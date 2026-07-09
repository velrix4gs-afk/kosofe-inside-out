import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function MarketplacePage() {
    const { data: listings, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!listings || listings.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No items listed yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Be the first to sell, buy, or trade in Kosofe!</p>
                </div>
            )}

            {!error && listings && listings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item) => (
                        <div key={item.id} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                            {/* Image Placeholder */}
                            <div className="h-40 bg-gray-200 flex items-center justify-center">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-800">{item.title}</h4>
                                {item.category && <span className="text-[10px] font-bold text-[#c41e3a] uppercase">{item.category}</span>}
                                {item.price && <p className="text-md font-bold text-gray-700 mt-1">💰 {item.price}</p>}
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 text-xs">
                                    {item.contact_phone && <a href={`tel:${item.contact_phone}`} className="text-[#c41e3a] font-bold">📞 Call</a>}
                                    {item.contact_email && <a href={`mailto:${item.contact_email}`} className="text-[#c41e3a] font-bold">✉️ Email</a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}