"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <>
            {/* --- TOP BAR --- */}
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

            {/* --- LOGO & AD BANNER --- */}
            <div className="bg-white py-6 border-b">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                    {/* Logo Image */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                        <Link href="/">
                            <Image
                                src="/img/kio-logo.jpg"
                                alt="Kosofe Inside Out Logo"
                                width={260}
                                height={70}
                                className="h-16 md:h-20 w-auto object-contain cursor-pointer"
                            />
                        </Link>
                    </div>
                    {/* Ad Banner Image */}
                    <div className="w-full md:w-[500px] h-[80px] relative rounded overflow-hidden shrink-0">
                        <Image
                            src="/img/kio-banner.jpg"
                            alt="Advertise with Kosofe Inside Out"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* --- MAIN NAVIGATION --- */}
            <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-3 gap-6">
                    <div className="flex items-center gap-6 text-sm font-bold text-gray-700 whitespace-nowrap">
                        <Link href="/" className="hover:text-[#c41e3a]">🏠 HOME</Link>
                        <Link href="/" className="bg-[#c41e3a] text-white px-3 py-1 rounded">NEWS</Link>
                        <Link href="/categories/politics" className="hover:text-[#c41e3a]">POLITICS</Link>
                        <Link href="/categories/governance" className="hover:text-[#c41e3a]">GOVERNANCE</Link>
                        <Link href="/categories/community" className="hover:text-[#c41e3a]">COMMUNITY</Link>
                        <Link href="/categories/business" className="hover:text-[#c41e3a]">BUSINESS</Link>
                        <Link href="/categories/entertainment" className="hover:text-[#c41e3a]">ENTERTAINMENT</Link>
                        <Link href="/categories/opinion" className="hover:text-[#c41e3a]">OPINION</Link>
                        <a href="#" className="hover:text-[#c41e3a]">MORE</a>
                    </div>
                    <Link href="/" className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e] whitespace-nowrap">
                        🔥 TRENDING
                    </Link>
                </div>
            </nav>
        </>
    );
}