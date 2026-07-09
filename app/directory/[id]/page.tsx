import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe, FaLinkedin } from "react-icons/fa";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: biz } = await supabase.from('directory_entries').select('business_name, address').eq('id', id).single();

    return {
        title: `${biz?.business_name} | Kosofe Business Directory`,
        description: `View ${biz?.business_name} in Kosofe. Contact them, get directions, and see their services.`,
    };
}

export default async function BusinessProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: biz, error } = await supabase
        .from('directory_entries')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !biz) notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Cover Photo */}
            <div className="relative h-48 md:h-64 bg-gray-200 rounded-t-xl overflow-hidden">
                {biz.cover_photo && (
                    <Image src={biz.cover_photo} alt={biz.business_name} fill className="object-cover" unoptimized />
                )}
                {biz.is_premium && (
                    <span className="absolute top-4 right-4 bg-[#c41e3a] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">PREMIUM</span>
                )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-b-xl shadow-sm border border-t-0 border-gray-200 relative">
                {/* Logo */}
                <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                    {biz.logo_url ? (
                        <Image src={biz.logo_url} alt={biz.business_name} width={80} height={80} className="object-cover" unoptimized />
                    ) : (
                        <span className="text-xs font-bold text-gray-400">Logo</span>
                    )}
                </div>

                <div className="mt-10 mb-6 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{biz.business_name}</h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-gray-100 text-[#c41e3a] text-xs font-bold px-2 py-1 rounded uppercase">{biz.category}</span>
                        {biz.subcategory && <span className="text-xs text-gray-500">• {biz.subcategory}</span>}
                        {biz.verified_level > 0 && (
                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">
                                ✓ Verified Level {biz.verified_level}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {biz.description && <p className="text-gray-700 leading-relaxed">{biz.description}</p>}

                        <div className="pt-4 border-t">
                            <h4 className="font-bold text-gray-800 text-sm mb-2">Services & Offers</h4>
                            <div className="flex flex-wrap gap-2">
                                {biz.services && biz.services.length > 0 ? (
                                    biz.services.map((s: string, idx: number) => (
                                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{s}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400">No services listed</span>
                                )}
                            </div>
                        </div>

                        {biz.payment_methods && biz.payment_methods.length > 0 && (
                            <div className="pt-2">
                                <h4 className="font-bold text-gray-800 text-sm mb-2">Payment Methods</h4>
                                <div className="flex flex-wrap gap-2">
                                    {biz.payment_methods.map((p: string, idx: number) => (
                                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{p}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-200 h-fit">
                        <h4 className="font-bold text-gray-800 text-sm border-b pb-2">Contact Information</h4>
                        {biz.phone && <p className="text-sm"><span className="font-semibold text-gray-500">📞 Phone:</span> <a href={`tel:${biz.phone}`} className="text-[#c41e3a]">{biz.phone}</a></p>}
                        {biz.whatsapp && <p className="text-sm"><span className="font-semibold text-gray-500">💬 WhatsApp:</span> <a href={`https://wa.me/${biz.whatsapp}`} target="_blank" className="text-[#c41e3a]">{biz.whatsapp}</a></p>}
                        {biz.email && <p className="text-sm"><span className="font-semibold text-gray-500">✉️ Email:</span> <a href={`mailto:${biz.email}`} className="text-[#c41e3a]">{biz.email}</a></p>}
                        {biz.address && <p className="text-sm"><span className="font-semibold text-gray-500">📍 Address:</span> {biz.address}</p>}
                        {biz.opening_hours && <p className="text-sm"><span className="font-semibold text-gray-500">🕐 Opening Hours:</span> {biz.opening_hours}</p>}

                        <div className="pt-4 border-t flex flex-wrap gap-3">
                            {biz.website && <a href={biz.website} target="_blank" className="text-gray-600 hover:text-[#c41e3a] text-xl"><FaGlobe /></a>}
                            {biz.instagram && <a href={`https://instagram.com/${biz.instagram}`} target="_blank" className="text-gray-600 hover:text-[#E4405F] text-xl"><FaInstagram /></a>}
                            {biz.facebook && <a href={`https://facebook.com/${biz.facebook}`} target="_blank" className="text-gray-600 hover:text-[#1877F2] text-xl"><FaFacebook /></a>}
                            {biz.tiktok && <a href={`https://tiktok.com/@${biz.tiktok}`} target="_blank" className="text-gray-600 hover:text-black text-xl"><FaTiktok /></a>}
                            {biz.linkedin && <a href={`https://linkedin.com/company/${biz.linkedin}`} target="_blank" className="text-gray-600 hover:text-[#0A66C2] text-xl"><FaLinkedin /></a>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}