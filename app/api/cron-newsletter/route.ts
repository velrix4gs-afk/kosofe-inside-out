import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin client (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    // 1. Fetch all subscribers
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

    // 2. Fetch the 5 most recent published stories
    const { data: latestStories } = await supabaseAdmin
        .from('articles')
        .select('id, title, excerpt, image_url, category, created_at') // ADDED 'id' HERE
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);

    // If no stories, use a generic headline
    const stories = (latestStories || []).slice(0, 5);

    // 3. Construct the story cards HTML
    const storyCardsHtml = stories.map(story => `
    <div style="margin-bottom: 24px; border-bottom: 1px solid #eeeeee; padding-bottom: 16px;">
      ${story.image_url ? `<img src="${story.image_url}" alt="${story.title}" style="width: 100%; border-radius: 8px; margin-bottom: 12px; object-fit: cover; height: 200px;" />` : ''}
      <p style="color: #c41e3a; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">${story.category || 'News'}</p>
      <h3 style="color: #333; font-size: 18px; margin-top: 0; margin-bottom: 8px;">${story.title}</h3>
      <p style="color: #555; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">${story.excerpt ? story.excerpt.substring(0, 150) + '...' : ''}</p>
      <a href="https://kosofeinsideout.com/articles/${story.id}" style="color: #c41e3a; font-weight: bold; font-size: 14px; text-decoration: none;">Read Full Story →</a>
    </div>
  `).join('');

    // 4. Construct the full email HTML
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c41e3a; padding-bottom: 20px;">
        <h1 style="color: #c41e3a; font-size: 28px; margin: 0;">Kosofe Inside Out</h1>
        <p style="color: #888; font-size: 12px; margin-top: 5px;">Your Daily Morning Digest</p>
      </div>
      
      <h2 style="color: #333; font-size: 22px; margin-bottom: 20px;">🌅 Good Morning! Here are today's top stories:</h2>
      
      ${storyCardsHtml || '<p>No new stories today. Check back tomorrow!</p>'}
      
      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px;">
        <a href="https://kosofeinsideout.com" style="background-color: #c41e3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Visit Kosofe Inside Out</a>
      </div>
      
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">You are receiving this email because you subscribed to Kosofe Inside Out. You can unsubscribe anytime.</p>
    </div>
  `;

    // 5. Send via Resend
    try {
        const { data, error: sendError } = await resend.emails.send({
            from: 'Kosofe Inside Out <news@kosofeinsideout.com>',
            replyTo: 'ilekanlawal@gmail.com',
            to: emails,
            subject: '🌅 Your Morning Kosofe Update',
            html: emailHtml,
        });

        if (sendError) {
            return Response.json({ error: sendError.message }, { status: 400 });
        }

        return Response.json({ message: `Successfully sent to ${emails.length} subscribers with ${stories.length} stories.`, data });
    } catch (err) {
        return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
}