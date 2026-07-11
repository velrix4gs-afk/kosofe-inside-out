// scripts/migrate-images.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';
import ws from 'ws'; // <-- ADD THIS

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env.migration') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials. Check your .env.migration file.");
    process.exit(1);
}

// WEBSOCKET FIX: Override global WebSocket with ws
globalThis.WebSocket = ws; // <-- ADD THIS

const supabase = createClient(supabaseUrl, supabaseKey); // No need to pass transport option now

// Mapping to track Old URL -> New URL
const urlMap = new Map();

async function uploadImage(imageId, originalUrl) {
    try {
        console.log(`⬇️ Downloading ${originalUrl}...`);

        const response = await fetch(originalUrl);
        if (!response.ok) {
            console.warn(`⚠️ Failed to download ${originalUrl} (Status: ${response.status})`);
            return;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const extension = path.extname(new URL(originalUrl).pathname) || '.jpg';
        const fileName = `migrated_${imageId}${extension}`;

        const { data, error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(fileName, buffer, {
                contentType: response.headers.get('content-type'),
                upsert: true,
            });

        if (uploadError) {
            console.error(`❌ Supabase Upload Error for ${fileName}:`, uploadError.message);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('article-images')
            .getPublicUrl(fileName);

        const newUrl = publicUrlData.publicUrl;
        urlMap.set(originalUrl, newUrl);
        console.log(`✅ Uploaded: ${fileName} -> ${newUrl}`);
    } catch (err) {
        console.error(`❌ Error processing ${originalUrl}:`, err.message);
    }
}

async function updateDatabaseTables() {
    console.log(`\n🔄 Updating database tables...`);
    let updatedCount = 0;

    for (const [oldUrl, newUrl] of urlMap.entries()) {
        const { error: articleError } = await supabase
            .from('articles')
            .update({ image_url: newUrl })
            .eq('image_url', oldUrl);

        if (articleError) {
            console.error(`❌ Failed to update article with old image: ${oldUrl}`, articleError.message);
        } else {
            updatedCount++;
        }

        const { error: galleryError } = await supabase
            .from('article_gallery')
            .update({ image_url: newUrl })
            .eq('image_url', oldUrl);

        if (galleryError) {
            console.error(`❌ Failed to update gallery with old image: ${oldUrl}`, galleryError.message);
        }
    }

    console.log(`✅ Database updates finished! Updated ${updatedCount} articles and their galleries.`);
}

async function runMigration(csvFilePath) {
    console.log(`📖 Reading CSV: ${csvFilePath}`);

    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let isFirstLine = true;
    const uploadPromises = [];

    for await (const line of rl) {
        if (isFirstLine) { isFirstLine = false; continue; }

        const parts = line.split(',');
        if (parts.length >= 3) {
            const id = parts[0].replace(/^"|"$/g, '');
            const url = parts[2].replace(/^"|"$/g, '');

            if (url) {
                uploadPromises.push(uploadImage(id, url));
            }
        }
    }

    console.log(`🚀 Processing ${uploadPromises.length} images...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < uploadPromises.length; i += BATCH_SIZE) {
        const batch = uploadPromises.slice(i, i + BATCH_SIZE);
        await Promise.all(batch);
        console.log(`✅ Uploaded batch ${i / BATCH_SIZE + 1} of ${Math.ceil(uploadPromises.length / BATCH_SIZE)}`);
    }

    await updateDatabaseTables();
}

const csvFile = process.argv[2];
if (!csvFile) {
    console.error('❌ Please provide the path to the CSV file.');
    console.error('Usage: node scripts/migrate-images.js scripts/export-media-urls.csv');
    process.exit(1);
}
runMigration(csvFile).catch(console.error);