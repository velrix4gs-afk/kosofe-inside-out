import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">About Kosofe Inside Out</h1>
            <div className="bg-white p-6 md:p-10 rounded shadow-sm space-y-4 text-gray-700 leading-relaxed">
                <p>
                    <strong>Kosofe Inside Out</strong> is a hyperlocal news and community intelligence platform dedicated to telling the real stories that shape Kosofe Local Government Area.
                </p>
                <p>
                    From local government projects and business openings to traffic updates and community events, we keep our residents informed, connected, and empowered. Our mission is to bridge the gap between governance and the everyday citizen through transparent, verified, and timely journalism.
                </p>
                <div className="mt-4 bg-[#f5f5f5] p-4 rounded border-l-4 border-[#c41e3a]">
                    <p className="font-bold text-gray-800">Our Core Values:</p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        <li><strong>Community First:</strong> Every story we tell puts Kosofe residents at the heart of it.</li>
                        <li><strong>Accountability:</strong> We hold leadership and institutions accountable through factual reporting.</li>
                        <li><strong>Integrity:</strong> We adhere strictly to journalistic ethics and verification.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}