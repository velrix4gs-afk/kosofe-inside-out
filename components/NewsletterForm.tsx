"use client";

export default function NewsletterForm() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Subscribed! (We will connect this to your newsletter backend later)");
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#c41e3a]"
                required
            />
            <button
                type="submit"
                className="bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] text-sm uppercase"
            >
                Subscribe Now
            </button>
        </form>
    );
}