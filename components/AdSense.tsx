"use client";
import { useEffect } from "react";

// Replace this with your actual AdSense Publisher ID
const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";

export default function AdSense() {
    useEffect(() => {
        try {
            // Push the ad slot to Google's queue
            (window.adsbygoogle = window.adsbygoogle || []).push({});
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
                data-ad-slot="YOUR_AD_SLOT_ID" // You will get this ID from AdSense once you create an ad unit
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}