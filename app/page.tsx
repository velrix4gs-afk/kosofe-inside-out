// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NewsletterForm from "@/components/NewsletterForm";
import AdSense from "@/components/AdSense";

export default async function Home() {
  let weather = { temp: 28, desc: "Clouds", feels_like: 28, humidity: 75, wind: 12, rain: 0, sunrise: 0, sunset: 0, uvIndex: 0 };
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (apiKey) {
      const [weatherRes, uvRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lagos&units=metric&appid=${apiKey}`, { next: { revalidate: 600 } }),
        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=6.5244&lon=3.3792&appid=${apiKey}`, { next: { revalidate: 600 } })
      ]);
      const weatherData = await weatherRes.json();
      const uvData = await uvRes.json();
      if (weatherData.main) {
        weather = {
          temp: Math.round(weatherData.main.temp),
          desc: weatherData.weather[0].main,
          feels_like: Math.round(weatherData.main.feels_like),
          humidity: weatherData.main.humidity,
          wind: Math.round(weatherData.wind.speed),
          rain: weatherData.rain ? Math.round(weatherData.rain['1h'] || 0) : 0,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          uvIndex: Math.round(uvData.value || 0)
        };
      }
    }
  } catch (e) { console.log("Weather API failed"); }

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: breakingNews } = await supabase
    .from('breaking_news')
    .select('*')
    .order('created_at', { ascending: false });

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

      {/* --- SPLIT MAIN BANNER (1 Big, 1 Small) --- */}
      <div className="w-full bg-white border-b py-2 md:py-4 px-4 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Big Banner (Takes up 2 columns on desktop) */}
          <Link href="/advertise" className="md:col-span-2 cursor-pointer hover:opacity-95 transition-opacity">
            <div className="w-full relative rounded overflow-hidden h-[60px] md:h-[100px]">
              <Image
                src="/img/kio-banner-main.jpg"
                alt="Advertise with Kosofe Inside Out"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          {/* Small Banner (Takes up 1 column) */}
          <Link href="/advertise" className="cursor-pointer hover:opacity-95 transition-opacity">
            <div className="w-full relative rounded overflow-hidden h-[60px] md:h-[100px]">
              <Image
                src="/img/kio-banner-side.jpg"
                alt="Advertise with Kosofe Inside Out"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* --- BREAKING NEWS TICKER --- */}
      <div className="w-full bg-[#f5f5f5] py-4 px-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white p-3 flex items-center gap-4 rounded shadow-sm border-l-4 border-[#c41e3a] overflow-hidden relative">
            <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 uppercase rounded-sm whitespace-nowrap flex-shrink-0 z-10">
              Breaking News
            </span>
            <div className="flex-1 overflow-hidden whitespace-nowrap relative h-5">
              <div className="breaking-news-slider w-full">
                {breakingNews && breakingNews.length > 0 ? (
                  <div className="animate-scroll-up flex flex-col">
                    {breakingNews.map((b) => (
                      <span key={b.id} className="h-5 leading-5 block">{b.message}</span>
                    ))}
                  </div>
                ) : (
                  <span className="h-5 leading-5 block">No breaking news at the moment.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="w-full px-0 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Story (Takes up 2 columns) */}
          <Link href={`/articles/${articles[0].id}`} className="lg:col-span-2 relative group cursor-pointer block">
            <div className="relative h-[400px] md:h-[550px] bg-gray-200 rounded overflow-hidden">
              <img src={articles[0]?.image_url || ''} alt={articles[0]?.title || 'Top Story'} className="w-full h-full object-cover bg-gray-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Top Story</span>
                <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mt-2">{articles[0]?.title}</h2>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">{articles[0]?.excerpt}</p>
                <div className="text-gray-400 text-xs mt-3">{new Date(articles[0]?.created_at).toLocaleDateString()} • 5 min read</div>
              </div>
            </div>
          </Link>

          {/* Sidebar Stories + SIDE AD SPACE (Takes up 1 column) */}
          <div className="flex flex-col gap-4">
            {/* Side Stories */}
            {articles.slice(1, 3).map((story, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-sm border-l-4 border-[#c41e3a] flex gap-4">
                <img src={story.image_url || ''} className="w-24 h-24 object-cover rounded bg-gray-200" alt={story.title} />
                <div>
                  <span className="text-[10px] font-bold text-[#c41e3a] uppercase">{story.category || "News"}</span>
                  <Link href={`/articles/${story.id}`} className="font-bold text-sm leading-snug mt-1 hover:text-[#c41e3a] cursor-pointer block">{story.title}</Link>
                  <p className="text-[10px] text-gray-500 mt-2">{new Date(story.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}

            {/* --- NEW SIDE AD SPACE --- */}
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200 flex justify-center items-center min-h-[120px]">
              <AdSense />
            </div>

            {/* Remaining Side Stories */}
            {articles.slice(3, 4).map((story, idx) => (
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
      </div>

      {/* --- WEATHER & STAY INFORMED --- */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white p-6 rounded shadow-sm flex flex-col md:flex-row gap-8 justify-between items-start">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#c41e3a] text-lg">Weather Update</h3>
              <span className="text-xs text-gray-500 font-medium">📍Kosofe, Lagos</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold">{weather.temp}°C</span>
                <div>
                  <p className="font-bold text-gray-700 text-lg">{weather.desc}</p>
                  <p className="text-xs text-gray-500">Feels Like {weather.feels_like}°C</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-sm text-gray-600">
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">Sunrise</span><span>{new Date(weather.sunrise * 1000).toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">Sunset</span><span>{new Date(weather.sunset * 1000).toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">UV Index</span><span className="font-medium text-yellow-600">{weather.uvIndex} (Moderate)</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">Rain %</span><span>{weather.rain} mm/h</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">Humidity</span><span>{weather.humidity}%</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-bold">Wind</span><span>{weather.wind} km/h</span></div>
            </div>
          </div>
          <div className="flex-1 w-full border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
            <h3 className="font-bold mb-2 text-lg">Get Kosofe’s Biggest Stories Every Morning</h3>
            <p className="text-sm text-gray-600 mb-4">Get the latest news and updates from Kosofe delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* --- CATEGORIES, FEATURES, FOLLOW, WHATSAPP --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg md:text-xl text-gray-800 uppercase">Explore By Category</h3>
          <Link href="/categories" className="text-xs font-bold text-[#c41e3a] hover:underline">View All Categories &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[{ name: 'POLITICS', desc: 'Stay updated in political decisions', icon: '🏛️' }, { name: 'GOVERNANCE', desc: 'Accountability, leadership, and policies', icon: '⚖️' }, { name: 'COMMUNITY', desc: 'Stories that celebrate our everyday life', icon: '👥' }, { name: 'BUSINESS', desc: 'Local business news, startups, and economy', icon: '📈' }, { name: 'ENTERTAINMENT', desc: 'Celebrity gist, events, and entertainment', icon: '⭐' }, { name: 'OPINION', desc: 'Thoughts, analysis, and views from Kosofe', icon: '✍️' }, { name: 'SPORTS', desc: 'Local games, athletes, and sporting events', icon: '⚽' }, { name: 'LIFESTYLE', desc: 'Culture, fashion, food, and community living', icon: '🌿' },].map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow-sm border-t-4 border-[#c41e3a] text-center cursor-pointer hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h4 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{cat.name}</h4>
              <p className="text-[10px] md:text-xs text-gray-500 leading-tight">{cat.desc}</p>
              <Link href={`/categories/${cat.name.toLowerCase()}`} className="mt-3 text-[10px] font-bold text-[#c41e3a] border border-[#c41e3a] px-3 py-1 rounded hover:bg-[#c41e3a] hover:text-white transition block">View all</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-6">FOLLOW US</h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://facebook.com/KosofeInsideOut" target="_blank" className="bg-[#1877F2] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 flex items-center gap-2">Facebook</a>
            <a href="https://x.com/kosofeinsideout" target="_blank" className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 flex items-center gap-2">X (Twitter)</a>
            <a href="https://instagram.com/kosofeinsideout" target="_blank" className="bg-[#E4405F] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 flex items-center gap-2">Instagram</a>
            <a href="https://youtube.com/@kosofeinsideout" target="_blank" className="bg-[#FF0000] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 flex items-center gap-2">YouTube</a>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center justify-between">
            TRENDING NOW
            <Link href="/trending" className="text-xs text-[#c41e3a] font-normal hover:underline">View All &rarr;</Link>
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

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-[#25D366] text-white p-6 rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg">Join our WhatsApp Channel</h4>
            <p className="text-sm opacity-90">Get real-time updates and breaking news delivered to your phone.</p>
          </div>
          <a href="https://whatsapp.com/channel/0029Vb7tfwGIiRoytADSsU1L" target="_blank"><button className="bg-white text-[#25D366] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition">Join Now</button></a>
        </div>
      </div>

    </main>
  );
}