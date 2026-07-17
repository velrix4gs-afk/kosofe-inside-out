"use client";
import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-6800852746478554";
const AD_SLOT_ID = "7655535836";

export default function AdSense() {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            // Add a tiny 100ms delay to allow the DOM layout to fully finish painting.
            const timer = setTimeout(() => {
                if (adRef.current && adRef.current.offsetWidth > 0) {
                    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                    (window as any).adsbygoogle.push({});
                } else {
                    console.log("AdSense skipped: container width is 0 (likely due to adblocker or staging env)");
                }
            }, 100); // 100ms is enough for the layout to settle

            // Clean up the timer if the component unmounts before it fires
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