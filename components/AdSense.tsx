"use client";
import { useEffect } from "react";

const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // Replace with your actual ID

export default function AdSense() {
    useEffect(() => {
        try {
            // The fix: using 'as any' to bypass TypeScript's strictness on the global window
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
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}