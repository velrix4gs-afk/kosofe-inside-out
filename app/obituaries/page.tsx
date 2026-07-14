import Link from "next/link";

export default function ObituariesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Obituaries & Memorials</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                <p className="text-4xl mb-4">🕊️</p>
                <h3 className="font-bold text-lg text-gray-800">In Loving Memory</h3>
                <p className="text-sm text-gray-500 mt-2">This page is a dedicated space to honor the lives of community members we have lost. If you have a memorial or funeral notice you'd like us to publish, please contact our editorial team.</p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link href="/contact" className="text-[#c41e3a] font-bold hover:underline text-sm">
                        Submit an Obituary →
                    </Link>
                </div>
            </div>
        </div>
    );
}