// app/admin/login/page.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // ✅ CHANGED: Redirects directly to the story dashboard
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-[#c41e3a]">Admin Login</h1>
                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c41e3a]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c41e3a]" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#c41e3a] text-white py-2 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}