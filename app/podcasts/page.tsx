import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function PodcastsPage() {
    const { data: podcasts, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('date', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Podcasts</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!podcasts || podcasts.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No episodes yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Stay tuned for our upcoming local talks and interviews.</p>
                </div>
            )}

            {!error && podcasts && podcasts.length > 0 && (
                <div className="space-y-6">
                    {podcasts.map((ep) => (
                        <div key={ep.id} className="bg-white p-6 rounded shadow-sm border border-gray-200 border-l-4 border-[#c41e3a]">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                <h4 className="font-bold text-lg text-gray-800">{ep.title}</h4>
                                <span className="text-xs text-gray-400">{new Date(ep.date).toLocaleDateString()}</span>
                            </div>
                            {ep.host && <p className="text-sm text-gray-500 mb-2">Hosted by: {ep.host}</p>}
                            {ep.description && <p className="text-sm text-gray-700 mb-4 leading-relaxed">{ep.description}</p>}
                            {ep.duration && <p className="text-xs text-gray-400 mb-2">Duration: {ep.duration}</p>}
                            <audio controls className="w-full mt-2 outline-none rounded bg-gray-50">
                                <source src={ep.audio_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}