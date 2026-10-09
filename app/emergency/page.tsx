import Link from "next/link";

const CONTACTS = [
    { name: "National Emergency Number", number: "112", desc: "Works on all networks in Nigeria — Police, Fire, Ambulance", isPrimary: true },
    { name: "Lagos Emergency Line", number: "767", desc: "Lagos State emergency hotline" },
    { name: "LASEMA (Emergency Management)", number: "0800 2255 5273", desc: "Lagos State Emergency Management Agency (Toll-free)" },
    { name: "Nigeria Police Force", number: "0806 154 9437", desc: "Crime, security, and police response" },
    { name: "Rapid Response Squad (RRS)", number: "0805 700 0000", desc: "Quick incident response in Lagos" },
    { name: "Lagos State Fire Service", number: "0806 212 9184", desc: "Fire and rescue operations" },
    { name: "LASTMA (Traffic Management)", number: "0700 2255 8762", desc: "Traffic complaints (Toll-free)" },
    { name: "FRSC (Road Safety)", number: "122", desc: "Road accidents and highway emergencies" },
    { name: "NEMA (National Emergency)", number: "0803 123 0893", desc: "Disaster and emergency response" },
];

export default function EmergencyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <Link href="/" className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">← Back</Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🆘 Emergency Contacts</h1>
            </div>
            <p className="text-sm text-gray-600 mb-6">Keep these numbers handy. Tap a number to call immediately.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONTACTS.map((contact, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded shadow-sm border-l-4 ${contact.isPrimary ? 'border-red-600 ring-2 ring-red-200' : 'border-[#c41e3a]'}`}>
                        <h4 className="font-bold text-gray-800">{contact.name}</h4>
                        <p className="text-xs text-gray-500 mb-3">{contact.desc}</p>
                        <a href={`tel:${contact.number.replace(/\s/g, '')}`} className={`inline-block text-white px-4 py-2 rounded font-bold text-sm ${contact.isPrimary ? 'bg-red-600 hover:bg-red-700' : 'bg-[#c41e3a] hover:bg-[#a0152e]'}`}>
                            📞 {contact.number}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}