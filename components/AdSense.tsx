"use client";
import { useEffect, useRef } from "react";

// YOUR NEW IDS:
const PUBLISHER_ID = "ca-pub-1724869420464430";
const AD_SLOT_ID = "8074139518";

export default function AdSense() {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            // Wait a tiny bit for the layout to settle, then push the ad
            const timer = setTimeout(() => {
                if (adRef.current && adRef.current.offsetWidth > 0) {
                    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                    (window as any).adsbygoogle.push({});
                } else {
                    console.log("AdSense skipped: container width is 0 (likely due to adblocker or staging env)");
                }
            }, 100);

            return () => clearTimeout(timer);
        } catch (err) {
            console.error("AdSense error:", err);
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