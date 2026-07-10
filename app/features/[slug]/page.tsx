import { notFound } from "next/navigation";
import Link from "next/link";
import { featureData } from "@/lib/featureData"; // <--- IMPORT FROM SHARED FILE

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Find the specific feature from the shared data
    const feature = featureData.find((f) => f.slug === slug);

    if (!feature) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <article className="bg-white p-6 md:p-10 rounded shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{feature.title}</h1>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4">{feature.desc}</p>

                {/* Increased height here too so the detail page shows the full image */}
                <img src={feature.img} alt={feature.title} className="w-full h-72 md:h-96 object-cover rounded mb-6 bg-gray-200" />

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {feature.content}
                </div>

                <div className="mt-8 pt-6 border-t flex justify-center">
                    <Link href="/features" className="text-sm font-bold text-[#c41e3a] hover:underline">
                        ← Back to All Features
                    </Link>
                </div>
            </article>
        </div>
    );
}