import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
            <div className="bg-white p-8 md:p-12 rounded shadow-sm text-center max-w-lg w-full">
                <p className="text-6xl md:text-7xl font-extrabold text-[#c41e3a] mb-2">404</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Page Not Found</h1>
                <p className="text-sm text-gray-500 mb-8">Oops! The page you're looking for doesn't exist. It may have been moved or deleted.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="bg-[#c41e3a] text-white px-6 py-3 rounded font-bold hover:bg-[#a0152e] transition">
                        ← Back to Homepage
                    </Link>
                    <Link href="/search" className="bg-gray-100 text-gray-700 px-6 py-3 rounded font-bold hover:bg-gray-200 transition">
                        🔍 Search the Site
                    </Link>
                </div>
            </div>
        </div>
    );
}