import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import ws from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://xznzsrlcinagmxdhedld.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bnpzcmxjaW5hZ214ZGhlZGxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAwOTQ5NiwiZXhwIjoyMDk4NTg1NDk2fQ.c60EpmcI7YcKKcppz9opu_nyDQNiMvebk_radsoQOrc";

globalThis.WebSocket = ws;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CSV_FILE = path.join(__dirname, 'finelib-kosofe-businesses.csv');

async function importCSV() {
    const businesses = [];
    console.log('📖 Reading CSV file...');

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (row) => {
            businesses.push({
                business_name: row.Name || '',
                address: row.Address || '',
                phone: row.Phone || '',
                description: row.Description || '',
                category: row.Category || 'Business', // Reads the category column!
                approved: false,
                is_premium: false,
                verified_level: 0,
                created_at: new Date().toISOString()
            });
        })
        .on('end', async () => {
            console.log(`✅ Parsed ${businesses.length} businesses.`);
            if (businesses.length === 0) return;

            const BATCH_SIZE = 50;
            let inserted = 0;

            for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
                const batch = businesses.slice(i, i + BATCH_SIZE);
                const { error } = await supabase.from('directory_entries').insert(batch);
                if (error) {
                    console.error(`❌ Error inserting batch:`, error.message);
                } else {
                    inserted += batch.length;
                    console.log(`✅ Inserted batch ${Math.ceil(i / BATCH_SIZE) + 1}`);
                }
            }
            console.log(`\n🎉 Import complete! ${inserted} businesses added.`);
        });
}

importCSV();