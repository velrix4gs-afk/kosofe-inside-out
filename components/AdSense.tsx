"use client";
import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-1724869420464430";
const AD_SLOT_ID = "8074139518";

export default function AdSense() {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ONLY run on the real production domain (not localhost, not IPs, not previews)
        if (typeof window === 'undefined') return;
        if (!window.location.hostname.includes('kosofeinsideout.com')) {
            return;
        }

        try {
            const timer = setTimeout(() => {
                if (adRef.current && adRef.current.offsetWidth > 0) {
                    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                    (window as any).adsbygoogle.push({});
                }
            }, 100);
            return () => clearTimeout(timer);
        } catch (err) {
            // Silently ignore — known Google script quirk
        }
    }, []);

    return (
        <div ref={adRef} className="w-full bg-white flex justify-center items-center py-4 border-b">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={PUBLISHER_ID}
                data-ad-slot={AD_SLOT_ID}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}