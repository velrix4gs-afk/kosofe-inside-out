import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default async function GalleryPage() {
    const { data: photos, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('date', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Photo Gallery</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!photos || photos.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No photos uploaded yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Showcase the beauty of Kosofe through our lens.</p>
                </div>
            )}

            {!error && photos && photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="bg-white rounded shadow-sm overflow-hidden border border-gray-200 relative group">
                            <div className="relative aspect-square bg-gray-100">
                                <Image
                                    src={photo.image_url}
                                    alt={photo.title || 'Gallery photo'}
                                    fill
                                    className="object-cover"
                                    unoptimized={true} // Add this to avoid sizing errors with remote URLs
                                />
                            </div>
                            <div className="p-3">
                                {photo.title && <h4 className="font-bold text-sm text-gray-800 truncate">{photo.title}</h4>}
                                {photo.photographer && <p className="text-xs text-gray-500">📸 {photo.photographer}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}