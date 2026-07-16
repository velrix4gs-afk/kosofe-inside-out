"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
        { name: 'Write Story', href: '/admin/dashboard/create', icon: '✍️' },
        { name: 'Directory', href: '/admin/directory', icon: '📂' },
        { name: 'Breaking News', href: '/admin/dashboard/breaking', icon: '📢' },
        { name: 'Logout', action: handleLogout, icon: '🚪' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-20 relative">
            {/* Main Admin Content */}
            <div className="p-4 max-w-6xl mx-auto">
                {children}
            </div>

            {/* Mobile Sticky Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center py-2 px-1">
                {navItems.map((item) => (
                    item.action ? (
                        <button key={item.name} onClick={item.action} className="flex flex-col items-center text-gray-500 hover:text-[#c41e3a] transition-colors p-1">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
                        </button>
                    ) : (
                        <Link key={item.name} href={item.href} className={`flex flex-col items-center p-1 transition-colors ${pathname === item.href ? 'text-[#c41e3a]' : 'text-gray-500 hover:text-[#c41e3a]'}`}>
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
}