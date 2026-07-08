import Link from "next/link";

export default function FeaturesPage() {
    const features = [
        { title: "Community Voices", desc: "Hear stories from real people in Kosofe.", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400", slug: "community-voices" },
        { title: "Business Spotlight", desc: "Highlighting local businesses making an impact.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400", slug: "business-spotlight" },
        { title: "Photos of the Week", desc: "A visual recap of Kosofe through our lens.", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400", slug: "photos-of-the-week" },
        { title: "Weekend Interview", desc: "In-depth conversations with influential personalities.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", slug: "weekend-interview" }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Special Features</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature) => (
                    <Link key={feature.slug} href={`/features/${feature.slug}`} className="bg-white rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition group">
                        <img src={feature.img} alt={feature.title} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <h4 className="font-bold text-gray-800 text-xl group-hover:text-[#c41e3a] transition-colors">{feature.title}</h4>
                            <p className="text-sm text-gray-500 mt-2">{feature.desc}</p>
                            <span className="mt-4 inline-block text-sm font-bold text-[#c41e3a]">Start Reading &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}