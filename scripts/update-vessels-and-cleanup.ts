import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function updateVesselsAndCleanup() {
  console.log('Updating vessel products and cleaning up incorrect INVICTA products...\n');

  // 1. Hide incorrect INVICTA AB series products (these shouldn't be INVICTA branded)
  console.log('=== Hiding Incorrect INVICTA AB Series Products ===');
  const invictaABProducts = [
    'INVICTA AB Series',
    'INVICTA AB500 Series',
    'INVICTA ABP Series',
    'INVICTA ABY Series',
  ];

  for (const productName of invictaABProducts) {
    const result = await query(
      `UPDATE products SET image_path = NULL, updated_at = NOW()
       WHERE name = $1 RETURNING name`,
      [productName]
    );
    if (result.length > 0) {
      console.log(`❌ Hidden: ${result[0].name} (image_path set to NULL)`);
    }
  }

  console.log('\n=== Updating Vessel Products with Available Images ===');

  // 2. Update SIEVA 600 HT with correct image
  console.log('\n=== Updating SIEVA 600 HT ===');
  const sieva600ht = await query(
    `UPDATE products SET image_path = $1, updated_at = NOW()
     WHERE name = $2 RETURNING name`,
    ['dpw_series_full_filter.jpg', 'SIEVA 600 HT Series']
  );
  if (sieva600ht.length > 0) {
    console.log(`✅ ${sieva600ht[0].name} → dpw_series_full_filter.jpg`);
  }

  // 3. Update vessel products with available local images
  const vesselUpdates = [
    // Use Seprum vessel image for SEPRUM vessels
    {
      name: 'SEPRUM Gas Filtration Vessels',
      image: 'Seprum Vessel 1.png',
      note: 'Using Seprum vessel image'
    },
    // Use Torrent vessel for TORRENT vessels
    {
      name: 'Torrent High Flow Vessels',
      image: 'Torrent Vessel copy.png',
      note: 'Using Torrent vessel image'
    },
    // Use Strata image for STRATA vessels
    {
      name: 'STRATA Emerald Hydrocarbon Absorption Vessels',
      image: 'Strata - 10inch boot-24 inch 5.JPG',
      note: 'Using Strata vessel image'
    },
    {
      name: 'STRATA Liquid-Liquid Coalescer Vessels',
      image: 'Strata - 10inch boot-24 inch 5.JPG',
      note: 'Using Strata vessel image'
    },
  ];

  for (const update of vesselUpdates) {
    const result = await query(
      `UPDATE products SET image_path = $1, updated_at = NOW()
       WHERE name = $2 RETURNING name`,
      [update.image, update.name]
    );
    if (result.length > 0) {
      console.log(`✅ ${result[0].name} → ${update.image}`);
      console.log(`   Note: ${update.note}`);
    }
  }

  console.log('\n=== Products Still Without Images ===');

  // 3. List remaining products without images
  const productsWithoutImages = await query(
    `SELECT p.name, pl.title as product_line
     FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.image_path IS NULL OR p.image_path = ''
     ORDER BY p.name`
  );

  if (productsWithoutImages.length > 0) {
    productsWithoutImages.forEach((p: any) => {
      console.log(`⚠️  ${p.name} (${p.product_line})`);
    });
  } else {
    console.log('✅ All products have images!');
  }

  console.log('\n=== Summary ===');
  console.log(`- Hidden 4 incorrect INVICTA AB series products`);
  console.log(`- Updated SIEVA 600 HT Series → dpw_series_full_filter.jpg`);
  console.log(`- Updated ${vesselUpdates.length} vessel products with available images`);
  console.log(`- ${productsWithoutImages.length} products still need images`);

  await closePool();
}

updateVesselsAndCleanup()
  .then(() => {
    console.log('\n✨ Update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
