import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function updateBetterImages() {
  console.log('Updating products with better quality images...\n');

  const updates = [
    { id: 'a1e5c3bb-1edb-441c-be53-c7c6afc0d14d', name: 'TERSUS 450', image: 'Tersus450.jpg' },
    { id: '5d00e93b-4f7f-4bb5-b26a-3c142b8c23fd', name: 'TERSUS 600', image: 'Terusu600.jpg' },
    { id: '3f2d9584-58d2-4c14-93c3-bd38b7193175', name: 'TORRENT 700', image: 'Torrent700_series_full.jpg' },
  ];

  for (const update of updates) {
    const result = await query(
      `UPDATE products SET image_path = $1, updated_at = NOW() WHERE id = $2 RETURNING name`,
      [update.image, update.id]
    );

    if (result.length > 0) {
      console.log(`✅ Updated ${result[0].name} → ${update.image}`);
    }
  }

  console.log('\n✨ Update complete!');
  await closePool();
}

updateBetterImages();
