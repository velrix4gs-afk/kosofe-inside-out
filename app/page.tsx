// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NewsletterForm from "@/components/NewsletterForm";

export default async function Home() {
  // --- FETCH LIVE WEATHER ---
  let weather = { temp: 28, desc: "Partly Cloudy", wind: 12, humidity: 75 };
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lagos&units=metric&appid=${apiKey}`, { next: { revalidate: 600 } });
      const data = await res.json();
      if (data.main) {
        weather = { temp: Math.round(data.main.temp), desc: data.weather[0].main, wind: Math.round(data.wind.speed), humidity: data.main.humidity };
      }
    }
  } catch (e) { console.log("Weather API failed"); }

  // --- FETCH PUBLISHED STORIES ---
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(10);

  // --- EMPTY STATE ---
  if (!articles || articles.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] font-sans flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded shadow-sm text-center max-w-md">
          <h1 className="text-3xl font-extrabold text-[#c41e3a] mb-2">KOSOFE INSIDE OUT</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Stories Yet</h2>
          <p className="text-sm text-gray-500 mb-6">Go to your Admin Dashboard to write your very first story!</p>
          <a href="/admin/dashboard" className="inline-block bg-[#c41e3a] text-white py-2 px-6 rounded font-bold text-sm hover:bg-[#a0152e]">Go to Admin Panel</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans">

      {/* --- BREAKING NEWS TICKER --- */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white p-3 flex items-center gap-4 rounded shadow-sm border-l-4 border-[#c41e3a]">
          <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 uppercase rounded-sm">Breaking News</span>
          <p className="text-sm font-medium truncate">{articles[0]?.title || "No breaking news at the moment."}</p>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <div className="lg:col-span-2 relative group cursor-pointer">
          <div className="relative h-[400px] bg-gray-200 rounded overflow-hidden">
            <img src={articles[0]?.image_url || ''} alt={articles[0]?.title || 'Top Story'} className="w-full h-full object-cover bg-gray-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Top Story</span>
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mt-2">{articles[0]?.title}</h2>
              <p className="text-gray-300 text-sm mt-2 line-clamp-2">{articles[0]?.excerpt}</p>
              <div className="text-gray-400 text-xs mt-3">{new Date(articles[0]?.created_at).toLocaleDateString()} • 5 min read</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {articles.slice(1, 4).map((story, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow-sm border-l-4 border-[#c41e3a] flex gap-4">
              <img src={story.image_url || ''} className="w-24 h-24 object-cover rounded bg-gray-200" alt={story.title} />
              <div>
                <span className="text-[10px] font-bold text-[#c41e3a] uppercase">{story.category || "News"}</span>
                <Link href={`/articles/${story.id}`} className="font-bold text-sm leading-snug mt-1 hover:text-[#c41e3a] cursor-pointer block">{story.title}</Link>
                <p className="text-[10px] text-gray-500 mt-2">{new Date(story.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- WEATHER & STAY INFORMED --- */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white p-6 rounded shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-[#c41e3a] mb-4">KOSOFE WEATHER</h3>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold">{weather.temp}°C</span>
              <span className="text-sm text-gray-600">{weather.desc}</span>
            </div>
            <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
              <span>Humidity: {weather.humidity}%</span>
              <span>Wind: {weather.wind} km/h</span>
              <span>Feels like: {weather.temp}°C</span>
            </div>
          </div>
          <div className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
            <h3 className="font-bold mb-2">STAY INFORMED</h3>
            <p className="text-sm text-gray-600 mb-4">Get the latest news and updates from Kosofe delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* --- EXPLORE BY CATEGORY --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg md:text-xl text-gray-800 uppercase">Explore By Category</h3>
          <a href="#" className="text-xs font-bold text-[#c41e3a] hover:underline">View All Categories &rarr;</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'POLITICS', desc: 'Stay updated in political decisions', icon: '🏛️' },
            { name: 'GOVERNANCE', desc: 'Accountability, leadership, and policies', icon: '⚖️' },
            { name: 'COMMUNITY', desc: 'Stories that celebrate our everyday life', icon: '👥' },
            { name: 'BUSINESS', desc: 'Local business news, startups, and economy', icon: '📈' },
            { name: 'ENTERTAINMENT', desc: 'Celebrity gist, events, and entertainment', icon: '⭐' },
            { name: 'OPINION', desc: 'Thoughts, analysis, and views from Kosofe', icon: '✍️' },
          ].map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow-sm border-t-4 border-[#c41e3a] text-center cursor-pointer hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h4 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{cat.name}</h4>
              <p className="text-[10px] md:text-xs text-gray-500 leading-tight">{cat.desc}</p>
              <Link href={`/categories/${cat.name.toLowerCase()}`} className="mt-3 text-[10px] font-bold text-[#c41e3a] border border-[#c41e3a] px-3 py-1 rounded hover:bg-[#c41e3a] hover:text-white transition block">View all</Link>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOLLOW US & TRENDING --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6">FOLLOW US</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#1877F2] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90">Facebook</button>
            <button className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90">X (Twitter)</button>
            <button className="bg-[#E4405F] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90">Instagram</button>
            <button className="bg-[#FF0000] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90">YouTube</button>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center justify-between">
            TRENDING NOW
            <span className="text-xs text-[#c41e3a] font-normal">View All &rarr;</span>
          </h3>
          <ul className="space-y-3 text-sm">
            {articles.slice(0, 5).map((story, idx) => (
              <li key={idx} className="flex gap-2 items-center">
                <span className="font-bold text-[#c41e3a] text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                <Link href={`/articles/${story.id}`} className="text-gray-800 hover:text-[#c41e3a] cursor-pointer truncate">{story.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- SPECIAL FEATURES --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg md:text-xl text-gray-800 uppercase">Special Features</h3>
          <a href="#" className="text-xs font-bold text-[#c41e3a] hover:underline">View All Features &rarr;</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Community Voices", desc: "Hear stories from real people in Kosofe.", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400" },
            { title: "Business Spotlight", desc: "Highlighting local businesses making an impact.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400" },
            { title: "Photos of the Week", desc: "A visual recap of Kosofe through our lens.", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400" },
            { title: "Weekend Interview", desc: "In-depth conversations with influential personalities.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition">
              <img src={feature.img} alt={feature.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{feature.title}</h4>
                <p className="text-xs text-gray-500">{feature.desc}</p>
                <span className="mt-2 inline-block text-[10px] font-bold text-[#c41e3a]">Read More &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- WHATSAPP CTA --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-[#25D366] text-white p-6 rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg">Join our WhatsApp Channel</h4>
            <p className="text-sm opacity-90">Get real-time updates and breaking news delivered to your phone.</p>
          </div>
          <button className="bg-white text-[#25D366] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition">Join Now</button>
        </div>
      </div>

    </main>
  );
}