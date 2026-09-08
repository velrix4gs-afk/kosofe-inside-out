import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    // 1. Fetch all emails from Supabase
    const { data: subscribers } = await supabase
        .from('subscribers')
        .select('email');

    if (!subscribers || subscribers.length === 0) {
        return Response.json({ message: 'No subscribers found' }, { status: 400 });
    }

    const emails = subscribers.map(s => s.email);

    // 2. Send the email to everyone
    try {
        const { data, error } = await resend.emails.send({
            from: 'Kosofe Inside Out <news@kosofeinsideout.com>',
            to: emails,
            subject: 'Your Morning Kosofe Update 🇳🇬',
            html: '<h1>Good Morning!</h1><p>Here are the biggest stories from Kosofe today.</p><p>Stay informed!</p>',
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json({ message: `Successfully sent to ${emails.length} subscribers`, data });
    } catch (err) {
        return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
}