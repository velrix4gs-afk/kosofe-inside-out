"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DirectoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");

    // Update the URL instantly without refreshing the page
    const updateFilters = (newQ: string, newCategory: string, newLocation: string) => {
        const params = new URLSearchParams();
        if (newQ) params.set("q", newQ);
        if (newCategory) params.set("category", newCategory);
        if (newLocation) params.set("location", newLocation);
        router.push(`/directory?${params.toString()}`, { scroll: false });
    };

    const resetFilters = () => {
        setQ("");
        setCategory("");
        setLocation("");
        router.push("/directory", { scroll: false });
    };

    const categories = [
        "Real Estate", "Food Services", "Security Services", "Transportation",
        "Automotive", "Health Services", "Educational Services", "Home and Living",
        "Beauty Salons", "Financial Services", "Professional Services", "Other"
    ];

    const locations = [
        "Ketu", "Mile 12", "Ojota", "Magodo", "Maryland", "Ikosi",
        "Agboyi", "Oworonshoki", "Anthony", "Mende", "Alapere", "Kosofe"
    ];

    return (
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search Box - Now searches everything */}
                <input
                    type="text"
                    placeholder="Search business, category, or location..."
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value);
                        updateFilters(e.target.value, category, location);
                    }}
                    className="flex-1 border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]"
                />

                {/* Category Dropdown - Instant Update */}
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        updateFilters(q, e.target.value, location);
                    }}
                    className="border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Location Dropdown - Instant Update */}
                <select
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        updateFilters(q, category, e.target.value);
                    }}
                    className="border p-2 rounded focus:ring-1 focus:ring-[#c41e3a]"
                >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={resetFilters}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm font-bold hover:bg-gray-200"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}