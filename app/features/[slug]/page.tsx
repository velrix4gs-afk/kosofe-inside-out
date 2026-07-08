import { notFound } from "next/navigation";
import Link from "next/link";

// Replicate the data from your homepage
const featureData = [
    {
        title: "Community Voices",
        desc: "Hear stories from real people in Kosofe.",
        img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400",
        slug: "community-voices",
        content: "In this week's Community Voices, we sit down with local residents who are making a quiet but massive impact in Kosofe. From teachers who have dedicated decades to educating the youth, to local artisans preserving traditional crafts, these are the unsung heroes that make our community thrive. Their stories remind us that real change begins right in our neighborhoods."
    },
    {
        title: "Business Spotlight",
        desc: "Highlighting local businesses making an impact.",
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400",
        slug: "business-spotlight",
        content: "This month's Business Spotlight features a Kosofe-born entrepreneur who turned a small side hustle into one of the leading logistics companies in Ketu. Despite the challenges of the Nigerian economy, they've managed to scale their business by focusing on hyper-local deliveries. They share their strategy, their struggles, and their hope for the future of local commerce."
    },
    {
        title: "Photos of the Week",
        desc: "A visual recap of Kosofe through our lens.",
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400",
        slug: "photos-of-the-week",
        content: "From the bustling markets of Agboyi-Ketu to the quiet, scenic corners of Ogudu, our photographers have captured the essence of Kosofe this week. This gallery highlights the best of local life, showcasing the colors, energy, and beauty that define our local government area."
    },
    {
        title: "Weekend Interview",
        desc: "In-depth conversations with influential personalities.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        slug: "weekend-interview",
        content: "This weekend, we sit down with a prominent figure in Kosofe governance. We discuss the upcoming local elections, the importance of youth involvement in politics, and the specific developmental projects set to break ground in our community over the next six months. An eye-opening conversation you won't want to miss."
    }
];

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Find the specific feature
    const feature = featureData.find((f) => f.slug === slug);

    // If it doesn't exist, show a 404 error
    if (!feature) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <article className="bg-white p-6 md:p-10 rounded shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{feature.title}</h1>
                <p className="text-sm text-gray-500 mb-6 border-b pb-4">{feature.desc}</p>

                <img src={feature.img} alt={feature.title} className="w-full h-64 md:h-96 object-cover rounded mb-6 bg-gray-200" />

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