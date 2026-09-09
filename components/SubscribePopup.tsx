"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubscribePopup() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [hasSeen, setHasSeen] = useState(false);

    useEffect(() => {
        // Check if user has already seen/subscribed in this browser
        const seen = localStorage.getItem('kio_popup_seen');
        if (seen) {
            setHasSeen(true);
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;

            // Trigger when user reaches 50% of the page
            if (scrollPosition > pageHeight * 0.5) {
                setShowModal(true);
                // Remove listener so it only triggers once
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        localStorage.setItem('kio_popup_seen', 'true');
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
    };

    if (hasSeen) return null;

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