import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const START_URL = "https://www.finelib.com/cities/lagos/areas-and-suburbs/kosofe";
const OUTPUT_FILE = path.join(__dirname, 'finelib-kosofe-businesses.csv');

function csvEscape(val) {
    const str = String(val || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

async function scrapeWithPuppeteer() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');
    await page.setDefaultTimeout(30000);

    await page.goto(START_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.bx-inner', { timeout: 15000 }).catch(() => { });

    // Get category links
    const categoryUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const uniqueLinks = new Set();
        links.forEach(link => {
            if (link.href.includes('/kosofe') && !link.href.includes('/listing/')) {
                uniqueLinks.add(link.href);
            }
        });
        return Array.from(uniqueLinks);
    });

    const allBusinesses = [];

    for (let i = 0; i < categoryUrls.length; i++) {
        let currentCategoryUrl = categoryUrls[i];
        let pageCount = 0;

        // Extract category name from URL
        const urlParts = currentCategoryUrl.split('/');
        const lastPart = urlParts.pop() || urlParts.pop(); // Handle trailing slash
        const categoryName = decodeURIComponent(lastPart.replace(/-/g, ' '));

        // Skip the main kosofe page if it doesn't have a subcategory
        if (categoryName.toLowerCase() === 'kosofe') continue;

        console.log(`\n📂 Scraping category: ${categoryName}`);

        while (currentCategoryUrl) {
            pageCount++;
            await page.goto(currentCategoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForSelector('.bx-inner', { timeout: 10000 }).catch(() => { });

            const businesses = await page.$$eval('.bx-inner', elements =>
                elements.map(element => {
                    const name = element.querySelector('.bx-headings a')?.textContent?.replace(/\s+/g, ' ').trim() || '';
                    const address = element.querySelector('.cmpny-lstng-1')?.textContent?.replace(/"/g, '').replace(/\s+/g, ' ').trim() || '';
                    const phone = element.querySelector('.tel-no-div')?.textContent?.replace(/[^\d,]/g, '') || '';
                    const description = element.querySelector('.listing-desc')?.textContent?.replace(/\s+/g, ' ').trim() || '';
                    return { name, address, phone, description };
                })
            );

            // Add category name to each business after scraping
            const categorizedBusinesses = businesses.map(b => ({
                ...b,
                category: categoryName
            }));

            allBusinesses.push(...categorizedBusinesses);
            console.log(`  ✅ Found ${businesses.length} on page ${pageCount}`);

            const nextLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a, button'));
                const nextLink = links.find(link =>
                    link.textContent.toLowerCase().includes('next') ||
                    link.classList.contains('next') ||
                    link.getAttribute('rel') === 'next'
                );
                return nextLink ? nextLink.href || null : null;
            });

            if (!nextLink) break;
            currentCategoryUrl = nextLink;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    await browser.close();

    const uniqueBusinesses = [...new Map(allBusinesses.map(b => [`${b.name}|${b.phone}`, b])).values()];

    // Write CSV with Category column
    const csvRows = [];
    csvRows.push('Name,Address,Phone Number,Description,Category');
    uniqueBusinesses.forEach(b => {
        csvRows.push(`${csvEscape(b.name)},${csvEscape(b.address)},${csvEscape(b.phone)},${csvEscape(b.description)},${csvEscape(b.category)}`);
    });

    fs.writeFileSync(OUTPUT_FILE, '\uFEFF' + csvRows.join('\n'), 'utf8');
    console.log(`\n🎉 Complete! Found ${uniqueBusinesses.length} businesses. CSV saved.`);
}

scrapeWithPuppeteer().catch(console.error);