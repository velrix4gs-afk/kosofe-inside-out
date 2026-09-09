import Link from "next/link";

export default function ReportStoryButton() {
    return (
        <Link
            href="/contact"
            className="fixed bottom-6 right-6 z-[999] bg-[#c41e3a] text-white px-4 py-3 rounded-full shadow-xl font-bold text-sm hover:bg-[#a0152e] hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
            <span>📢</span> Report a Story
        </Link>
    );
}