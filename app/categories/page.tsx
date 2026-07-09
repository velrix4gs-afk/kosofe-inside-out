import Link from "next/link";

export default function CategoriesPage() {
    const categories = [
        { name: 'POLITICS', desc: 'Stay updated in political decisions', icon: '🏛️', slug: 'politics' },
        { name: 'GOVERNANCE', desc: 'Accountability, leadership, and policies', icon: '⚖️', slug: 'governance' },
        { name: 'COMMUNITY', desc: 'Stories that celebrate our everyday life', icon: '👥', slug: 'community' },
        { name: 'BUSINESS', desc: 'Local business news, startups, and economy', icon: '📈', slug: 'business' },
        { name: 'ENTERTAINMENT', desc: 'Celebrity gist, events, and entertainment', icon: '⭐', slug: 'entertainment' },
        { name: 'OPINION', desc: 'Thoughts, analysis, and views from Kosofe', icon: '✍️', slug: 'opinion' },
        { name: 'SPORTS', desc: 'Local games, athletes, and sporting events', icon: '⚽', slug: 'sports' },
        { name: 'LIFESTYLE', desc: 'Culture, fashion, food, and community living', icon: '🌿', slug: 'lifestyle' },
        { name: 'TECHNOLOGY', desc: 'Innovation, gadgets, and digital trends', icon: '💻', slug: 'technology' },
        { name: 'ENVIRONMENT', desc: 'Climate, nature, and local sustainability', icon: '🌍', slug: 'environment' },
        { name: 'AGRICULTURE', desc: 'Farming, food security, and agribusiness', icon: '🌾', slug: 'agriculture' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">All Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.slug} href={`/categories/${cat.slug}`} className="bg-white p-8 rounded shadow-sm border-t-4 border-[#c41e3a] text-center cursor-pointer hover:shadow-md transition-all duration-200">
                        <div className="text-5xl mb-4">{cat.icon}</div>
                        <h4 className="font-bold text-gray-800 text-xl mb-2">{cat.name}</h4>
                        <p className="text-sm text-gray-500">{cat.desc}</p>
                        <div className="mt-4 text-xs font-bold text-[#c41e3a] border border-[#c41e3a] px-3 py-1 rounded inline-block hover:bg-[#c41e3a] hover:text-white transition">Explore</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}