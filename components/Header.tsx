"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

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
            <div className="bg-white py-2 md:py-4 border-b">
                <div className="max-w-6xl mx-auto px-4 flex justify-center md:justify-start">
                    <Link href="/">
                        <Image
                            src="/img/kio-logo.jpg"
                            alt="Kosofe Inside Out Logo"
                            width={240}
                            height={60}
                            className="h-12 md:h-20 w-auto object-contain cursor-pointer"
                        />
                    </Link>
                </div>
            </div>

            {/* --- MAIN NAVIGATION --- */}
            <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3 gap-4 md:gap-6">

                    <div className="flex items-center gap-4 md:gap-6 text-sm font-bold text-gray-700 whitespace-nowrap overflow-x-auto pb-1 pr-4 no-scrollbar">
                        <Link href="/" className="hover:text-[#c41e3a]">🏠 Home</Link>

                        <Link href="/categories/news" className={`px-3 py-1 rounded transition-colors ${pathname === '/categories/news' ? 'bg-[#c41e3a] text-white' : 'hover:text-[#c41e3a]'}`}>
                            News
                        </Link>

                        <Link href="/categories/politics" className={`${pathname === '/categories/politics' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Politics</Link>
                        <Link href="/categories/governance" className={`${pathname === '/categories/governance' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Governance</Link>
                        <Link href="/categories/community" className={`${pathname === '/categories/community' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Community</Link>
                        <Link href="/categories/business" className={`${pathname === '/categories/business' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Business</Link>
                        <Link href="/categories/sports" className={`${pathname === '/categories/sports' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Sports</Link>
                        <Link href="/categories/entertainment" className={`${pathname === '/categories/entertainment' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Entertainment</Link>
                        <Link href="/directory" className={`${pathname === '/directory' ? 'text-[#c41e3a] border-b-2 border-[#c41e3a]' : 'hover:text-[#c41e3a]'}`}>Directory</Link>

                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-1 font-bold text-gray-700 hover:text-[#c41e3a] px-2 py-1 border border-transparent hover:border-[#c41e3a] rounded transition"
                        >
                            More <span className="text-[10px]">▾</span>
                        </button>
                    </div>

                    <Link href="/trending" className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e] whitespace-nowrap shrink-0 hidden sm:block">
                        🔥 Trending
                    </Link>
                </div>
            </nav>

            {/* --- RIGHT-SIDE SLIDE-OUT DRAWER --- */}
            <div className={`fixed inset-0 z-[999] ${drawerOpen ? 'visible' : 'invisible'}`}>
                <div className="fixed inset-0 bg-black/50 transition-opacity duration-300" onClick={() => setDrawerOpen(false)}></div>
                <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-lg text-[#c41e3a]">More</span>
                        <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-[#c41e3a] p-1 rounded hover:bg-gray-100 transition">
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="overflow-y-auto h-full pb-10">
                        {moreLinks.map((link) => {
                            // --- FIXED ROUTING LOGIC ---
                            let href = `/${link.toLowerCase().replace(/ /g, '-')}`;
                            if (link === 'Contact') href = '/contact';
                            if (link === 'Public Notices') href = '/notices';
                            if (link === 'Opinion') href = '/categories/opinion';
                            if (link === 'Lifestyle') href = '/categories/lifestyle';
                            if (link === 'Photo Gallery') href = '/gallery';
                            if (link === 'Videos') href = '/videos';
                            if (link === 'Podcasts') href = '/podcasts';
                            if (link === 'Obituaries') href = '/obituaries';
                            if (link === 'Emergency') href = '/emergency'; // reserved for future
                            if (link === 'Education' || link === 'Health' || link === 'Technology' || link === 'Environment' || link === 'Agriculture') {
                                href = `/categories/${link.toLowerCase()}`;
                            }
                            // ----------------------------
                            return (
                                <Link key={link} href={href} onClick={() => setDrawerOpen(false)} className="block px-6 py-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 hover:text-[#c41e3a] transition-colors">
                                    {link}
                                </Link>
                            );
                        })}

                        {/* 🔐 ADMIN LOGIN BUTTON */}
                        <div className="border-t-2 border-[#c41e3a] mt-2">
                            <Link
                                href="/admin/login"
                                onClick={() => setDrawerOpen(false)}
                                className="block px-6 py-4 bg-[#fdf2f2] text-[#c41e3a] font-bold hover:bg-[#c41e3a] hover:text-white transition-colors text-center border-b border-gray-100"
                            >
                                🔐 Admin Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}