import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe } from "react-icons/fa";

export default async function DirectoryPage() {
    const { data: businesses, error } = await supabase
        .from('directory_entries')
        .select('*')
        .eq('approved', true)
        .order('is_premium', { ascending: false })
        .order('business_name', { ascending: true });

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
                        <div key={biz.id} className={`bg-white rounded shadow-sm border border-gray-200 overflow-hidden relative flex flex-col ${biz.is_premium ? 'border-l-4 border-[#c41e3a]' : ''}`}>

                            {/* Cover Photo & Logo */}
                            <div className="relative h-32 bg-gray-200">
                                {biz.cover_photo && (
                                    <Image src={biz.cover_photo} alt={biz.business_name} fill className="object-cover" unoptimized />
                                )}
                                {/* Premium Badge */}
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

                                    {/* Verified Badge */}
                                    {biz.verified_level > 0 && (
                                        <span className="inline-block bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                                            ✓ Verified Level {biz.verified_level}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-4 pb-4 space-y-2">
                                {biz.description && <p className="text-sm text-gray-600 line-clamp-2">{biz.description}</p>}
                                {biz.opening_hours && <p className="text-xs text-gray-500 font-medium">🕐 {biz.opening_hours}</p>}
                                {biz.address && <p className="text-xs text-gray-500">📍 {biz.address}</p>}

                                {/* Socials */}
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                                    {biz.phone && <a href={`tel:${biz.phone}`} className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-[#c41e3a] text-xs font-bold">📞 Call</a>}
                                    {biz.whatsapp && <a href={`https://wa.me/${biz.whatsapp}`} target="_blank" className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-green-600"><FaWhatsapp /></a>}
                                    {biz.instagram && <a href={`https://instagram.com/${biz.instagram}`} target="_blank" className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-[#E4405F]"><FaInstagram /></a>}
                                    {biz.facebook && <a href={`https://facebook.com/${biz.facebook}`} target="_blank" className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-[#1877F2]"><FaFacebook /></a>}
                                    {biz.tiktok && <a href={`https://tiktok.com/@${biz.tiktok}`} target="_blank" className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-black"><FaTiktok /></a>}
                                    {biz.website && <a href={biz.website} target="_blank" className="bg-gray-100 p-1.5 rounded text-gray-700 hover:text-[#c41e3a]"><FaGlobe /></a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}