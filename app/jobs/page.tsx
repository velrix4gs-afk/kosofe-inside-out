import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function JobsPage() {
    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Local Job Opportunities</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>

            {error && <div className="bg-red-50 p-4 rounded text-red-700 text-sm">{error.message}</div>}

            {!error && (!jobs || jobs.length === 0) && (
                <div className="bg-white p-10 rounded shadow-sm text-center border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">No jobs posted yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Check back soon for new opportunities.</p>
                </div>
            )}

            {!error && jobs && jobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded shadow-sm border border-gray-200 border-l-4 border-[#c41e3a]">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                <h4 className="font-bold text-lg text-gray-800">{job.title}</h4>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">{job.company} • {job.location}</p>
                            {job.salary && <p className="text-sm text-gray-500 mt-1">💰 {job.salary}</p>}
                            <p className="text-sm text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
                                {job.contact_email && <a href={`mailto:${job.contact_email}`} className="text-[#c41e3a] font-bold hover:underline">✉️ Apply via Email</a>}
                                {job.contact_phone && <a href={`tel:${job.contact_phone}`} className="text-[#c41e3a] font-bold hover:underline ml-2">📞 Call to Apply</a>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}