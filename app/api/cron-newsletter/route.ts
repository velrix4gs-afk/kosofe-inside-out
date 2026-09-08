import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin client (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    // Fetch all subscribers
    const { data: subscribers, error } = await supabaseAdmin
        .from('subscribers')
        .select('email');

    if (error) {
        return Response.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
        return Response.json({ message: 'No subscribers found' }, { status: 400 });
    }

    const emails = subscribers.map(s => s.email);

    // Fetch latest story
    const { data: latestStory } = await supabaseAdmin
        .from('articles')
        .select('title, excerpt, image_url')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    const storyTitle = latestStory?.title || "Kosofe Inside Out Morning Update";
    const storyExcerpt = latestStory?.excerpt || "Stay up to date with the latest local news.";
    const storyImage = latestStory?.image_url || "https://xznzsrlcinagmxdhedld.supabase.co/storage/v1/object/public/article-images/kio-og-image.png";

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #c41e3a; text-align: center;">Kosofe Inside Out</h1>
      <h2 style="color: #333;">${storyTitle}</h2>
      <img src="${storyImage}" alt="Story Image" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
      <p style="color: #555; font-size: 16px; line-height: 1.6;">${storyExcerpt}</p>
      <a href="https://kosofeinsideout.com" style="background-color: #c41e3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 16px;">Read Full Story</a>
    </div>
  `;

    try {
        const { data, error: sendError } = await resend.emails.send({
            // FROM ADDRESS FIX: Use Resend's onboarding address if your domain email is getting blocked
            from: 'Kosofe Inside Out <onboarding@resend.dev>',
            // REPLY-TO FIX: So when subscribers hit "Reply", it goes to your inbox
            reply_to: 'ilekanlawal@gmail.com',
            to: emails,
            subject: `🌅 ${storyTitle}`,
            html: emailHtml,
        });

        if (sendError) {
            return Response.json({ error: sendError.message }, { status: 400 });
        }

        return Response.json({ message: `Successfully sent to ${emails.length} subscribers`, data });
    } catch (err) {
        return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
}