export const dynamic = 'force-dynamic';
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SingleReview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: review } = await supabase
        .from("week_reviews")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

    if (!review) notFound();

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link href="/week-in-review" className="text-sm text-[#c41e3a] font-bold hover:underline mb-4 inline-block">
                ← Back to All Weeks
            </Link>

            <article className="bg-white p-6 md:p-10 rounded shadow-sm">
                <p className="text-xs font-bold text-[#c41e3a] uppercase mb-2">
                    {review.week_start_date && review.week_end_date
                        ? `${new Date(review.week_start_date).toLocaleDateString()} – ${new Date(review.week_end_date).toLocaleDateString()}`
                        : new Date(review.created_at).toLocaleDateString()}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{review.title}</h1>

                {review.cover_image && (
                    <img src={review.cover_image} alt={review.title} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" />
                )}

                {review.summary && (
                    <p className="text-lg text-gray-600 italic mb-6 border-l-4 border-[#c41e3a] pl-4">{review.summary}</p>
                )}

                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {review.content}
                </div>
            </article>
        </div>
    );
}