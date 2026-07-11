// scripts/migrate.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseStringPromise, processors } from 'xml2js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env.migration') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials. Check your .env.migration file.");
    process.exit(1);
}

globalThis.WebSocket = ws;
const supabase = createClient(supabaseUrl, supabaseKey);

async function parseXML(filePath) {
    const xml = fs.readFileSync(filePath, 'utf8');
    const result = await parseStringPromise(xml, {
        explicitArray: true,
        ignoreAttrs: false,
        tagNameProcessors: [processors.stripPrefix],
    });
    return result;
}

function buildAttachmentMap(items) {
    const map = new Map();
    for (const item of items) {
        const postType = item['post_type']?.[0];
        const attachmentUrl = item['attachment_url']?.[0];
        const postId = item['post_id']?.[0];
        if (postType === 'attachment' && attachmentUrl && postId) {
            map.set(postId, attachmentUrl);
        }
    }
    return map;
}

function extractImageUrls(html) {
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

async function migrate(filePath) {
    console.log(`🔍 Parsing XML file...`);
    const parsed = await parseXML(filePath);
    const channel = parsed.rss.channel[0];
    const items = channel.item || [];

    const attachmentMap = buildAttachmentMap(items);

    let postsInserted = 0;
    let errors = 0;
    const BATCH_SIZE = 50;

    console.log(`Found ${items.length} entries. Processing...`);

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const insertPromises = [];

        for (const item of batch) {
            // Now using correct keys without 'wp:'
            const postType = item['post_type']?.[0] || '';
            const status = item['status']?.[0] || '';

            // Only import published posts
            if (postType !== 'post' || status !== 'publish') continue;

            const title = item.title?.[0] || 'No Title';
            const content = item['encoded']?.[0] || ''; // 'encoded' is the correct key

            // Categories are stored in the 'category' field (array)
            const rawCategories = item.category || [];
            const categoryNames = rawCategories.map(cat => typeof cat === 'string' ? cat : cat._ || '');
            const mainCategory = categoryNames.length > 0 ? categoryNames[0] : 'News';
            const tagsArray = categoryNames.length > 1 ? categoryNames.slice(1) : [];

            // Author is in 'creator'
            const author = item['creator']?.[0] || 'Admin';
            const dateStr = item['post_date']?.[0] || '';
            const publishedDate = dateStr ? new Date(dateStr) : new Date();

            // Featured image
            let featuredImageUrl = null;
            const metas = item['postmeta'] || [];
            for (const metaGroup of metas) {
                const metaKey = metaGroup['meta_key']?.[0];
                if (metaKey === '_thumbnail_id') {
                    const attachmentId = metaGroup['meta_value']?.[0];
                    if (attachmentMap.has(attachmentId)) {
                        featuredImageUrl = attachmentMap.get(attachmentId);
                    }
                    break;
                }
            }

            const allImages = extractImageUrls(content);
            const galleryImages = allImages.filter(url => url !== featuredImageUrl);

            insertPromises.push(async () => {
                const { data: article, error: articleError } = await supabase
                    .from('articles')
                    .insert({
                        title: title,
                        content: content,
                        category: mainCategory,
                        tags: tagsArray,
                        image_url: featuredImageUrl,
                        author: author,
                        created_at: publishedDate,
                        published: true,
                        views: Math.floor(Math.random() * 100)
                    })
                    .select()
                    .single();

                if (articleError) {
                    console.error(`❌ Failed to insert article: "${title}"`, articleError.message);
                    errors++;
                    return;
                }

                if (galleryImages.length > 0) {
                    const galleryInserts = galleryImages.map(url => ({
                        article_id: article.id,
                        image_url: url,
                        is_main: false,
                    }));
                    const { error: galleryError } = await supabase
                        .from('article_gallery')
                        .insert(galleryInserts);
                    if (galleryError) {
                        console.error(`⚠️ Article imported but gallery failed for: "${title}"`, galleryError.message);
                    }
                }
                postsInserted++;
            });
        }

        await Promise.all(insertPromises.map(fn => fn()));
        console.log(`✅ Processed batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(items.length / BATCH_SIZE)}`);
    }

    console.log(`\n🎉 Migration Complete!`);
    console.log(`📝 Stories Successfully Imported: ${postsInserted}`);
    console.log(`❌ Errors Encountered: ${errors}`);
}

const xmlFile = process.argv[2];
if (!xmlFile) {
    console.error('❌ Please provide the path to the XML file.');
    console.error('Usage: node scripts/migrate.js scripts/wordpress.2026-07-11.xml');
    process.exit(1);
}
migrate(xmlFile).catch(console.error);