import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function WeekInReviewPage() {
    const { data: reviews } = await supabase
        .from("week_reviews")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-8 border-b pb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Week in Review</h1>
                <p className="text-gray-500 mt-2 text-sm">The biggest Kosofe stories, summarised every week.</p>
            </div>

            {(!reviews || reviews.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <p className="text-gray-500">No weekly reviews published yet. Check back soon.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews?.map((review) => (
                    <Link
                        key={review.id}
                        href={`/week-in-review/${review.id}`}
                        className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition block group"
                    >
                        {review.cover_image && (
                            <div className="relative h-48 bg-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={review.cover_image} alt={review.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                        )}
                        <div className="p-5">
                            <p className="text-[10px] font-bold text-[#c41e3a] uppercase mb-1">
                                {review.week_start_date && review.week_end_date
                                    ? `${new Date(review.week_start_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} – ${new Date(review.week_end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                    : new Date(review.created_at).toLocaleDateString()}
                            </p>
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#c41e3a] transition-colors line-clamp-2">
                                {review.title}
                            </h3>
                            {review.summary && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{review.summary}</p>
                            )}
                            <span className="mt-3 inline-block text-xs font-bold text-[#c41e3a]">Read Full Recap →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}