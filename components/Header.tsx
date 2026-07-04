"use client";
<div className="bg-[#1a1a1a] text-white text-[11px] py-2">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <div className="flex items-center gap-3 text-gray-400">
                <span className="hover:text-white cursor-pointer font-bold">FB</span>
                <span className="hover:text-white cursor-pointer font-bold">X</span>
                <span className="hover:text-white cursor-pointer font-bold">IG</span>
                <span className="hover:text-white cursor-pointer font-bold">YT</span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white">Advertise With Us</a>
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Contact Us</a>
            <span className="hover:text-white cursor-pointer">🔍</span>
        </div>
    </div>
</div>

{/* Inside the Logo & Ad Banner section */ }
<div className="w-full md:w-auto flex justify-center md:justify-start">
    <Image
        src="/img/kio-logo.jpg"  // Starts with /, pointing to public/img
        alt="Kosofe Inside Out Logo"
        width={220}               // Required to remove red lines
        height={60}               // Required to remove red lines
        className="h-14 md:h-16 w-auto object-contain"
    />
</div>
{/* Ad Banner Image */ }
<div className="w-full md:w-[800px] h-[80px] flex items-center justify-center overflow-hidden shrink-0 rounded">
    <img
        src="/img/kio-banner.jpg"
        alt="Advertise with Kosofe Inside Out"
        className="w-full h-full object-contain"
    />
</div>

{/* --- MAIN NAVIGATION --- */ }
< nav className="bg-white border-b shadow-sm sticky top-0 z-50" >
    <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-3 gap-6">
        <div className="flex items-center gap-6 text-sm font-bold text-gray-700 whitespace-nowrap">
            <a href="#" className="bg-[#c41e3a] text-white px-3 py-1 rounded">NEWS</a>
            <a href="#" className="hover:text-[#c41e3a]">POLITICS</a>
            <a href="#" className="hover:text-[#c41e3a]">GOVERNANCE</a>
            <a href="#" className="hover:text-[#c41e3a]">COMMUNITY</a>
            <a href="#" className="hover:text-[#c41e3a]">BUSINESS</a>
            <a href="#" className="hover:text-[#c41e3a]">ENTERTAINMENT</a>
            <a href="#" className="hover:text-[#c41e3a]">OPINION</a>
            <a href="#" className="hover:text-[#c41e3a]">MORE</a>
        </div>
        <button className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e] whitespace-nowrap">
            🔥 TRENDING
        </button>
    </div>
</nav >