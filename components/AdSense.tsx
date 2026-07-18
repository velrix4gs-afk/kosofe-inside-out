"use client";
import { useEffect, useRef, useState } from "react";

const PUBLISHER_ID = "ca-pub-6800852746478554";
const AD_SLOT_ID = "7655535836";

export default function AdSense() {
    const adRef = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        try {
            const timer = setTimeout(() => {
                if (adRef.current && adRef.current.offsetWidth > 0) {
                    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                    (window as any).adsbygoogle.push({});
                } else {
                    // If width is 0, we hide the container completely so it doesn't leave a white hole
                    setShouldRender(false);
                }
            }, 100);
            return () => clearTimeout(timer);
        } catch (err) {
            console.error("AdSense error:", err);
            setShouldRender(false);
        }
    }, []);

    if (!shouldRender) return null;

    return (
        <div ref={adRef} className="w-full bg-white flex justify-center items-center py-4 border-b min-h-[100px]">
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