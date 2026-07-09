"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [moreOpen, setMoreOpen] = useState(false);

  const moreLinks = [
    "Education", "Health", "Lifestyle", "Opinion", 
    "Public Notices", "Jobs", "Events", "Marketplace", 
    "Technology", "Environment", "Agriculture", "Obituaries", 
    "Photo Gallery", "Videos", "Podcasts", "Contact"
  ];

  return (
    <>
      {/* --- TOP BAR --- */}
      <div className="bg-[#1a1a1a] text-white text-[11px] py-2">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="https://facebook.com/KosofeInsideOut" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer"><FaFacebook /></a>
              <a href="https://x.com/kosofeinsideout" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer"><FaTwitter /></a>
              <a href="https://instagram.com/kosofeinsideout" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer"><FaInstagram /></a>
              <a href="https://youtube.com/@kosofeinsideout" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer"><FaYoutube /></a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Contact Us</a>
            <Link href="/search" className="bg-gray-800 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1 hover:bg-gray-700 transition">
              <span className="font-bold">🔍</span> <span className="hidden sm:inline">Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- LOGO --- */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-6xl mx-auto px-4 flex justify-center md:justify-start">
          <Link href="/">
            <Image
              src="/img/kio-logo.jpg"
              alt="Kosofe Inside Out Logo"
              width={280}
              height={70}
              className="h-14 md:h-20 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-3 gap-4 md:gap-6">
          <div className="flex items-center gap-4 md:gap-6 text-sm font-bold text-gray-700 whitespace-nowrap">
            <Link href="/" className="hover:text-[#c41e3a]">🏠 Home</Link>
            <Link href="/" className="bg-[#c41e3a] text-white px-3 py-1 rounded">News</Link>
            <Link href="/categories/politics" className="hover:text-[#c41e3a]">Politics</Link>
            <Link href="/categories/governance" className="hover:text-[#c41e3a]">Governance</Link>
            <Link href="/categories/community" className="hover:text-[#c41e3a]">Community</Link>
            <Link href="/categories/business" className="hover:text-[#c41e3a]">Business</Link>
            <Link href="/categories/sports" className="hover:text-[#c41e3a]">Sports</Link>
            <Link href="/categories/entertainment" className="hover:text-[#c41e3a]">Entertainment</Link>
            <Link href="/directory" className="hover:text-[#c41e3a]">Directory</Link>
            
            {/* --- MORE DROPDOWN --- */}
            <div className="relative inline-block text-left group">
              <button 
                onClick={() => setMoreOpen(!moreOpen)} 
                className="hover:text-[#c41e3a] border border-transparent hover:border-[#c41e3a] px-2 py-1 rounded transition flex items-center gap-1 font-bold"
              >
                More <span className="text-[10px]">▾</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 transition-opacity duration-200 ${moreOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:group-hover:opacity-100 md:group-hover:visible md:opacity-0 md:invisible`}>
                <div className="py-1 flex flex-col text-sm text-gray-700">
                  {moreLinks.map((link) => {
                    const slug = link.toLowerCase().replace(/ /g, '-');
                    let href = `/${slug}`;
                    if (link === 'Contact') href = '/contact';
                    if (link === 'Public Notices') href = '/notices';
                    if (link === 'Opinion') href = '/categories/opinion';
                    if (link === 'Lifestyle') href = '/categories/lifestyle';
                    if (link === 'Education' || link === 'Health' || link === 'Technology' || link === 'Environment' || link === 'Agriculture') {
                      href = `/categories/${slug}`;
                    }
                    return (
                      <Link key={link} href={href} className="block px-4 py-2 hover:bg-gray-100 hover:text-[#c41e3a] transition-colors">
                        {link}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/" className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e] whitespace-nowrap shrink-0">
            🔥 Trending
          </Link>
        </div>
      </nav>
    </>
  );
}