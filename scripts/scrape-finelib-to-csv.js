// scripts/scrape-finelib-to-csv.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://www.finelib.com";
const START_URL = "https://www.finelib.com/cities/lagos/areas-and-suburbs/kosofe";
const OUTPUT_FILE = path.join(__dirname, 'finelib-kosofe-businesses.csv');

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
                },
                timeout: 15000
            });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

function cleanText(str) {
    return (str || '').replace(/\s+/g, ' ').trim();
}

function csvEscape(val) {
    const str = String(val || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

async function scrapePage(url) {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const businesses = [];

    // --- THE EXACT FIX FROM YOUR SCREENSHOT ---
    $('.bx-inner').each((index, element) => {
        const name = cleanText($(element).find('.bx-headings a').first().text());
        const address = cleanText($(element).find('.cmpny-lstng-1').first().text().replace('"', ''));
        const phone = cleanText($(element).find('.tel-no-div').first().text().replace(/[^\d,]/g, '')); // Removes non-numeric characters except commas
        const description = cleanText($(element).find('.listing-desc').first().text());

        // Only include if we have at least a name
        if (name) {
            businesses.push({ name, address, phone, description });
        }
    });

    // Find pagination link (if exists) - next page button
    let nextUrl = null;
    const nextLink = $('a[rel="next"], .pagination a:contains("Next")').attr('href');
    if (nextLink) {
        nextUrl = new URL(nextLink, BASE_URL).href;
    }

    return { businesses, nextUrl };
}

async function main() {
    console.log('🚀 Starting scrape of Finelib Kosofe...');

    let currentUrl = START_URL;
    let allBusinesses = [];
    let pageCount = 0;

    while (currentUrl) {
        pageCount++;
        console.log(`📄 Scraping page ${pageCount}: ${currentUrl}`);

        try {
            const { businesses, nextUrl } = await scrapePage(currentUrl);
            allBusinesses = allBusinesses.concat(businesses);
            currentUrl = nextUrl;
        } catch (error) {
            console.error(`❌ Error scraping ${currentUrl}:`, error.message);
            break;
        }

        // Safety break: limit to 10 pages
        if (pageCount >= 10) break;
    }

    // Remove duplicates (by name + phone)
    const uniqueBusinesses = [...new Map(allBusinesses.map(b => [`${b.name}|${b.phone}`, b])).values()];

    // Write to CSV
    const csvRows = [];
    csvRows.push('Name,Address,Phone Number,Description');
    uniqueBusinesses.forEach(b => {
        csvRows.push(`${csvEscape(b.name)},${csvEscape(b.address)},${csvEscape(b.phone)},${csvEscape(b.description)}`);
    });

    fs.writeFileSync(OUTPUT_FILE, '\uFEFF' + csvRows.join('\n'), 'utf8');

    console.log(`\n✅ Scraping complete! Found ${uniqueBusinesses.length} unique businesses.`);
    console.log(`📁 CSV saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);