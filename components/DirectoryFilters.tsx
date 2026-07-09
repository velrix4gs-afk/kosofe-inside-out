"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DirectoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [openNow, setOpenNow] = useState(searchParams.get("open_now") === "true");

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        if (location) params.set("location", location);
        if (openNow) params.set("open_now", "true");
        router.push(`/directory?${params.toString()}`);
    };

    const resetFilters = () => {
        setQ(""); setCategory(""); setLocation(""); setOpenNow(false);
        router.push("/directory");
    };

    return (
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search business name..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="flex-1 border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]"
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]">
                    <option value="">All Categories</option>
                    <option>Food & Restaurants</option>
                    <option>Shopping</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Automotive</option>
                    <option>Professional Services</option>
                    <option>Home Services</option>
                    <option>Beauty</option>
                    <option>Hospitality</option>
                    <option>Real Estate</option>
                    <option>Technology</option>
                    <option>Financial Services</option>
                </select>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]">
                    <option value="">All Locations</option>
                    <option>Ketu</option>
                    <option>Mile 12</option>
                    <option>Ojota</option>
                    <option>Magodo</option>
                    <option>Maryland</option>
                    <option>Ikosi</option>
                    <option>Agboyi</option>
                    <option>Oworonshoki</option>
                    <option>Anthony</option>
                    <option>Mende</option>
                    <option>Alapere</option>
                    <option>Kosofe</option>
                </select>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />
                    <span className="text-gray-700 font-medium">Open Now</span>
                </label>
                <div className="flex gap-2">
                    <button onClick={applyFilters} className="bg-[#c41e3a] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-[#a0152e]">Apply Filters</button>
                    <button onClick={resetFilters} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-200">Reset</button>
                </div>
            </div>
        </div>
    );
}