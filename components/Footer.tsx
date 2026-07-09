"use client";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-gray-400 py-12 mt-8 border-t border-gray-800 pb-12">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                {/* Col 1: Brand & Socials */}
                <div>
                    <h2 className="text-white text-xl font-extrabold tracking-tight mb-4">
                        KOSOFE <span className="text-[#c41e3a]">INSIDE OUT</span>
                    </h2>
                    <p className="text-xs leading-relaxed mb-4">Kosofe Inside Out is your trusted source for hyperlocal news.</p>
                    <div className="flex gap-4">
                        <a href="https://facebook.com/KosofeInsideOut" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white text-sm"><FaFacebook /></a>
                        <a href="https://x.com/kosofeinsideout" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white text-sm"><FaTwitter /></a>
                        <a href="https://instagram.com/kosofeinsideout" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white text-sm"><FaInstagram /></a>
                        <a href="https://youtube.com/@kosofeinsideout" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white text-sm"><FaYoutube /></a>
                    </div>
                </div>

                {/* Col 2: Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/about" className="hover:text-[#c41e3a] transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[#c41e3a] transition-colors">Contact Us</Link></li>
                        <li><Link href="/advertise" className="hover:text-[#c41e3a] transition-colors">Advertise With Us</Link></li>
                    </ul>
                </div>

                {/* Col 3: Categories */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Categories</h4>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/categories/politics" className="hover:text-[#c41e3a] transition-colors">Politics</Link></li>
                        <li><Link href="/categories/governance" className="hover:text-[#c41e3a] transition-colors">Governance</Link></li>
                        <li><Link href="/categories/community" className="hover:text-[#c41e3a] transition-colors">Community</Link></li>
                        <li><Link href="/categories/business" className="hover:text-[#c41e3a] transition-colors">Business</Link></li>
                        <li><Link href="/categories/entertainment" className="hover:text-[#c41e3a] transition-colors">Entertainment</Link></li>
                    </ul>
                </div>

                {/* Col 4: Contact Info */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contact Us</h4>
                    <ul className="space-y-3 text-xs">
                        <li className="flex flex-col">
                            <span className="text-gray-500">Address:</span>
                            <span className="text-gray-300">31, Adetoro Adelaja Street, Magodo Phase 2, Lagos.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500">Email:</span>
                            <span className="text-[#c41e3a]">kosofeinsideout@gmail.com</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500">Phone Number:</span>
                            <span className="text-[#c41e3a]">+234 802 849 4099</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-[10px] text-gray-600">
                &copy; {new Date().getFullYear()} Kosofe Inside Out. All Rights Reserved.
            </div>
        </footer>
    );
}