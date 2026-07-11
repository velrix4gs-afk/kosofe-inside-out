// scripts/migrate-images.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';
import ws from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env.migration') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials.");
    process.exit(1);
}

globalThis.WebSocket = ws;
const supabase = createClient(supabaseUrl, supabaseKey);

const urlMap = new Map();
const failedLog = [];

// Helper: Retry fetch with backoff
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (res.ok) return res;
        } catch (e) {
            if (i === retries - 1) throw e;
            // Wait 2 seconds before retry
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    throw new Error('Max retries reached');
}

async function uploadImage(imageId, originalUrl) {
    try {
        // 1. Check file size via HEAD request
        let headRes;
        try {
            headRes = await fetch(originalUrl, { method: 'HEAD' });
        } catch {
            // If HEAD fails, we still attempt GET
        }
        const contentLength = headRes?.headers?.get('content-length');
        if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
            console.warn(`⚠️ Skipping (too large >5MB): ${originalUrl}`);
            failedLog.push(`[TOO_LARGE] ${originalUrl}`);
            return;
        }

        console.log(`⬇️ Downloading ${originalUrl}...`);
        const response = await fetchWithRetry(originalUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const extension = path.extname(new URL(originalUrl).pathname) || '.jpg';
        const fileName = `migrated_${imageId}${extension}`;

        // 2. Upload to Supabase
        const { error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(fileName, buffer, {
                contentType: response.headers.get('content-type'),
                upsert: true,
            });

        if (uploadError) {
            // If the error is about size limit, log and skip
            if (uploadError.message.includes('max allowed file size')) {
                console.warn(`⚠️ Supabase size limit reached for ${fileName}`);
                failedLog.push(`[SIZE_LIMIT] ${originalUrl}`);
                return;
            }
            throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from('article-images')
            .getPublicUrl(fileName);

        const newUrl = publicUrlData.publicUrl;
        urlMap.set(originalUrl, newUrl);
        console.log(`✅ Uploaded: ${fileName}`);
    } catch (err) {
        console.error(`❌ Failed: ${originalUrl}`, err.message);
        failedLog.push(`[FAILED] ${originalUrl}`);
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

        if (!articleError) updatedCount++;

        await supabase
            .from('article_gallery')
            .update({ image_url: newUrl })
            .eq('image_url', oldUrl);
    }

    console.log(`✅ Updated ${updatedCount} articles and galleries.`);
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
            if (url) uploadPromises.push(uploadImage(id, url));
        }
    }

    console.log(`🚀 Processing ${uploadPromises.length} images...`);
    const BATCH_SIZE = 10;
    for (let i = 0; i < uploadPromises.length; i += BATCH_SIZE) {
        const batch = uploadPromises.slice(i, i + BATCH_SIZE);
        await Promise.all(batch);
        console.log(`✅ Batch ${i / BATCH_SIZE + 1} done.`);
    }

    await updateDatabaseTables();

    // Save failed logs
    if (failedLog.length > 0) {
        fs.writeFileSync('failed_images.txt', failedLog.join('\n'));
        console.log(`📄 ${failedLog.length} images failed. Check 'failed_images.txt' for details.`);
    }
}

const csvFile = process.argv[2];
if (!csvFile) {
    console.error('❌ Please provide the CSV file path.');
    process.exit(1);
}
runMigration(csvFile).catch(console.error);