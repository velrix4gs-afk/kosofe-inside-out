import Link from "next/link";

export default function ReportStoryButton() {
    return (
        <div className="max-w-3xl mx-auto px-4 pb-8">
            <div className="bg-gradient-to-r from-[#c41e3a] to-[#a0152e] text-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                    <h3 className="font-bold text-xl md:text-2xl">📢 Report a Story & Earn</h3>
                    <p className="text-sm md:text-base mt-1 opacity-90">
                        Earn as much as <span className="font-bold text-yellow-300">₦25,000</span> for a story from your community.
                    </p>
                </div>
                <Link
                    href="/contribute"
                    className="bg-white text-[#c41e3a] px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition whitespace-nowrap shadow-md"
                >
                    Apply Now →
                </Link>
            </div>
        </div>
    );
}