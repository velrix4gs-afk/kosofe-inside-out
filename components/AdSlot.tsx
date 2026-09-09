import { supabase } from "@/lib/supabase";

export default async function AdSlot({ placement }: { placement: string }) {
    const { data: ads } = await supabase
        .from("advertisements")
        .select("*")
        .eq("placement", placement)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1);

    if (!ads || ads.length === 0) return null;

    const ad = ads[0];

    return (
        <a href={ad.link_url || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
            {ad.video_url ? (
                <video
                    src={ad.video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto object-contain"
                />
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.image_url} alt={ad.title || "Advertisement"} className="w-full h-auto object-contain" />
            )}
        </a>
    );
}