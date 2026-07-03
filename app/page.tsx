// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight">
            KOSOFE <span className="text-[#c41e3a]">INSIDE OUT</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-[#c41e3a]">NEWS</a>
          <a href="#" className="hover:text-[#c41e3a]">POLITICS</a>
          <a href="#" className="hover:text-[#c41e3a]">GOVERNANCE</a>
          <a href="#" className="hover:text-[#c41e3a]">COMMUNITY</a>
          <a href="#" className="hover:text-[#c41e3a]">BUSINESS</a>
        </div>
        <button className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e]">
          🔥 TRENDING
        </button>
      </nav>

      {/* --- BREAKING NEWS TICKER --- */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white p-3 flex items-center gap-4 rounded shadow-sm border-l-4 border-[#c41e3a]">
          <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 uppercase rounded-sm">Breaking News</span>
          <p className="text-sm font-medium truncate">
            Lagos Assembly Moves to Abolish LCDAs, Creates 37 New Administrative Areas
          </p>
        </div>
      </div>

      {/* --- HERO SECTION (The Big Grid) --- */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">

        {/* LEFT: Top Story (Takes up 2 columns) */}
        <div className="lg:col-span-2 relative group cursor-pointer">
          <div className="relative h-[400px] bg-gray-200 rounded overflow-hidden">
            {/* Replace this src with a real image later */}
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
              alt="Top Story"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Content on the image */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                Top Story
              </span>
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mt-2">
                Sanwo-Olu Commends Agboyi-Ketu Chairman During 170-Home Commissioning
              </h2>
              <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                The Lagos State Governor lauded Hon. Dele Oshinowo for people-focused leadership and impactful delivery.
              </p>
              <div className="text-gray-400 text-xs mt-3">June 4, 2025 • 5 min read</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Stories (Takes up 1 column) */}
        <div className="flex flex-col gap-4">

          {/* Story 1 */}
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#c41e3a] flex gap-4">
            <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 object-cover rounded" alt="news" />
            <div>
              <span className="text-[10px] font-bold text-[#c41e3a] uppercase">Breaking</span>
              <h4 className="font-bold text-sm leading-snug mt-1 hover:text-[#c41e3a] cursor-pointer">
                Lagos Assembly Moves to Abolish LCDAs
              </h4>
              <p className="text-[10px] text-gray-500 mt-2">10 mins ago</p>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#2c3e50] flex gap-4">
            <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 object-cover rounded" alt="news" />
            <div>
              <span className="text-[10px] font-bold text-[#2c3e50] uppercase">Community</span>
              <h4 className="font-bold text-sm leading-snug mt-1 hover:text-[#c41e3a] cursor-pointer">
                Agboyi-Ketu Gets New Road Projects
              </h4>
              <p className="text-[10px] text-gray-500 mt-2">1 hour ago</p>
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#2c3e50] flex gap-4">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 object-cover rounded" alt="news" />
            <div>
              <span className="text-[10px] font-bold text-[#2c3e50] uppercase">Security</span>
              <h4 className="font-bold text-sm leading-snug mt-1 hover:text-[#c41e3a] cursor-pointer">
                Police Warn Miscreants as Operations Intensify
              </h4>
              <p className="text-[10px] text-gray-500 mt-2">2 hours ago</p>
            </div>n
          </div>

        </div>
      </div>
    </main>
  );
}