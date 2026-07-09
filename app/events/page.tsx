import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function EventsPage() {
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true }); // Soonest events first

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Community Events</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!events || events.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No upcoming events</h3>
                    <p className="text-sm text-gray-500 mt-1">Stay tuned for community gatherings and town halls.</p>
                </div>
            )}

            {!error && events && events.length > 0 && (
                <div className="space-y-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white p-6 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                            {/* Date Block */}
                            <div className="bg-[#c41e3a] text-white w-16 h-16 rounded flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-800">{event.title}</h4>
                                <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 mt-1 mb-2">
                                    <span>🕐 {event.time || 'Time TBA'}</span>
                                    <span>📍 {event.location}</span>
                                    {event.organizer && <span>👤 {event.organizer}</span>}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}