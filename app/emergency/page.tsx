import Link from "next/link";

const EMERGENCY_CONTACTS = [
    { name: "Lagos State Police Command", number: "0812 222 2000", desc: "Emergency response, crime reporting." },
    { name: "Rapid Response Squad (RRS)", number: "0901 000 1911", desc: "Quick incident response in Lagos." },
    { name: "Lagos State Fire Service", number: "0803 333 1111", desc: "Fire emergencies and rescue operations." },
    { name: "LASAMBUS (Ambulance)", number: "0800 LASEMA", desc: "Medical emergencies and ambulance services." },
    { name: "Federal Road Safety (FRSC)", number: "0700 FRSC 111", desc: "Road accidents and traffic emergencies." },
    { name: "LASTMA Traffic Control", number: "0700 527 8625", desc: "Traffic complaints and assistance." },
];

export default function EmergencyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Emergency Contacts</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>
            <p className="text-sm text-gray-600 mb-6">Keep these numbers handy. Tap a number to call immediately.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EMERGENCY_CONTACTS.map((contact, idx) => (
                    <div key={idx} className="bg-white p-6 rounded shadow-sm border-l-4 border-[#c41e3a]">
                        <h4 className="font-bold text-gray-800">{contact.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{contact.desc}</p>
                        <a href={`tel:${contact.number}`} className="inline-block bg-[#c41e3a] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a0152e] transition">
                            📞 {contact.number}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}