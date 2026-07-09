import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function VideosPage() {
    const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('date', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Videos</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!videos || videos.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No videos uploaded yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Stay tuned for local stories and interviews on video.</p>
                </div>
            )}

            {!error && videos && videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-black relative">
                                {/* Safely render the iframe using the embed URL stored in the DB */}
                                <iframe
                                    src={video.video_url}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={video.title}
                                />
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-800 leading-tight">{video.title}</h4>
                                {video.description && <p className="text-sm text-gray-500 mt-2">{video.description}</p>}
                                <p className="text-xs text-gray-400 mt-2">{new Date(video.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}