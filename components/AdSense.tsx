"use client";
import { useEffect } from "react";

// Your verified Publisher ID
const PUBLISHER_ID = "ca-pub-6800852746478554";
// The Ad Slot ID he just sent you
const AD_SLOT_ID = "7655535836";

export default function AdSense() {
    useEffect(() => {
        try {
            // Tell Google to load the ad
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className="w-full bg-white flex justify-center items-center py-4 border-b">
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