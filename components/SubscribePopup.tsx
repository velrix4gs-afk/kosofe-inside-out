"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubscribePopup() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
        // 1. Check if user already subscribed (Never show again)
        const subscribed = localStorage.getItem('kio_subscribed');
        if (subscribed) return;

        // 2. Check when they last saw the popup
        const lastShown = localStorage.getItem('kio_popup_last_shown');
        const now = Date.now();
        const threeAndHalfDays = 3.5 * 24 * 60 * 60 * 1000; // milliseconds

        // If it's been less than 3.5 days since they last saw it, don't show it
        if (lastShown && now - parseInt(lastShown) < threeAndHalfDays) {
            return;
        }

        // 3. Random check: Only 50% of users will see it on this visit
        const randomChance = Math.random() < 0.5;
        if (!randomChance) {
            return;
        }

        // 4. If all good, let it show after 50% scroll
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            if (scrollPosition > pageHeight * 0.5) {
                setCanShow(true);
                setShowModal(true);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        localStorage.setItem('kio_popup_last_shown', Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const { error } = await supabase.from('subscribers').insert({ email });

        if (error) {
            if (error.code === '23505') {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } else {
            setStatus('success');
        }

        // If they successfully subscribe, store the flag so it never shows again
        if (!error || error.code === '23505') {
            localStorage.setItem('kio_subscribed', 'true');
        }
    };

    if (!canShow) return null;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>

                        {/* Content */}
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Get Kosofe's Biggest Stories</h2>
                            <p className="text-gray-600 text-sm mt-2">Every morning. Directly in your inbox. No spam, just news.</p>
                        </div>

                        {/* Form */}
                        {status === 'success' ? (
                            <div className="text-green-600 font-bold text-center py-4">
                                🎉 You're in! Check your inbox tomorrow.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-[#c41e3a] text-white py-3 rounded font-bold hover:bg-[#a0152e] disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-600 text-xs text-center">Oops. Something went wrong. Try again.</p>
                                )}
                            </form>
                        )}

                        <p className="text-center text-[10px] text-gray-400 mt-4">
                            Join thousands of Kosofe residents reading daily.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}