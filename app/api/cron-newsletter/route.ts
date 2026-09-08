import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    // 1. Fetch the latest published story
    const { data: latestStory } = await supabase
        .from('articles')
        .select('title, excerpt, image_url, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // 2. Fetch all subscriber emails
    const { data: subscribers } = await supabase
        .from('subscribers')
        .select('email');

    if (!subscribers || subscribers.length === 0) {
        return Response.json({ message: 'No subscribers found' }, { status: 400 });
    }

    const emails = subscribers.map(s => s.email);

    // 3. Construct the email
    const storyTitle = latestStory?.title || "Kosofe Inside Out Morning Update";
    const storyExcerpt = latestStory?.excerpt || "Stay up to date with the latest local news.";
    const storyImage = latestStory?.image_url || "https://xznzsrlcinagmxdhedld.supabase.co/storage/v1/object/public/article-images/kio-og-image.png";

    const emailHtml = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #c41e3a; text-align: center;">Kosofe Inside Out</h1>
      <h2 style="color: #333;">Your Morning Story: ${storyTitle}</h2>
      <img src="${storyImage}" alt="Story Image" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
      <p style="color: #555; font-size: 16px; line-height: 1.6;">${storyExcerpt}</p>
      <a href="https://kosofeinsideout.com" style="background-color: #c41e3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 16px;">Read Full Story</a>
      <p style="color: #999; font-size: 12px; margin-top: 32px;">You are receiving this email because you subscribed to Kosofe Inside Out.</p>
    </div>
  `;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Kosofe Inside Out <news@kosofeinsideout.com>',
            to: emails,
            subject: `🌅 ${storyTitle}`,
            html: emailHtml,
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json({ message: `Successfully sent to ${emails.length} subscribers`, data });
    } catch (err) {
        return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
}