"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const { error } = await supabase
            .from('subscribers')
            .insert({ email });

        if (error) {
            // If it's a duplicate email error, tell the user they are already subscribed
            if (error.code === '23505') {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } else {
            setStatus('success');
            setEmail('');
        }
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#c41e3a]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] text-sm uppercase disabled:opacity-50"
            >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
            </button>
            {status === 'success' && <p className="text-green-600 text-xs text-center font-bold">Success! You're on the list.</p>}
            {status === 'error' && <p className="text-red-600 text-xs text-center font-bold">Oops. Something went wrong. Try again.</p>}
        </form>
    );
}