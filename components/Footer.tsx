"use client";

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-gray-400 py-12 mt-8 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                {/* Col 1: Brand */}
                <div>
                    <h2 className="text-white text-xl font-extrabold tracking-tight mb-4">
                        KOSOFE <span className="text-[#c41e3a]">INSIDE OUT</span>
                    </h2>
                    <p className="text-xs leading-relaxed mb-4">Kosofe Inside Out is your trusted source for hyperlocal news, community intelligence, and stories that shape our lives in Kosofe.</p>
                    <div className="flex gap-4 text-xs">
                        <span className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white">FB</span>
                        <span className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white">X</span>
                        <span className="bg-gray-800 p-2 rounded cursor-pointer hover:text-white">IG</span>
                    </div>
                </div>

                {/* Col 2: Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
                    <ul className="space-y-2 text-xs">
                        <li className="hover:text-[#c41e3a] cursor-pointer">About Us</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Contact Us</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Advertise With Us</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>

                {/* Col 3: Categories */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Categories</h4>
                    <ul className="space-y-2 text-xs">
                        <li className="hover:text-[#c41e3a] cursor-pointer">Politics</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Governance</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Community</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Business</li>
                        <li className="hover:text-[#c41e3a] cursor-pointer">Entertainment</li>
                    </ul>
                </div>

                {/* Col 4: Contact Info */}
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contact Us</h4>
                    <ul className="space-y-3 text-xs">
                        <li className="flex flex-col">
                            <span className="text-gray-500">Address:</span>
                            <span>1, Kosofe Road, Ketu, Lagos State, Nigeria.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500">Email:</span>
                            <span className="text-[#c41e3a]">info@kosofeinsideout.com</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500">Phone:</span>
                            <span>+234 800 123 4567</span>
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