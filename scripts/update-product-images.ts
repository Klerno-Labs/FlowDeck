/**
 * Script to update all product images with correct file mappings
 * Run with: tsx scripts/update-product-images.ts
 */

// Load environment variables FIRST
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Now import database dependencies
import { query } from '../src/lib/db/client';
import * as fs from 'fs';

const LOCAL_IMAGE_BASE = 'C:\\Users\\Somli\\OneDrive\\Desktop\\Flowdeck\\FTC\\Product';

// Complete product image mapping based on user confirmation
const productImageMap: Record<string, string> = {
  // CLARIFY
  'clarify-250': 'ab_series_soe_222_full.jpg',
  'clarify-280': 'Clarify 280_2.png', // 202 KB file
  'clarify-300': 'abp_series_full_1.jpg',
  'clarify-380': 'aby_series_full_2.jpg',
  'clarify-430': 'Clarify430.jpg',
  'clarify-500': 'ab500_series_pair.psd',
  'clarify-740-premium': 'pdp740_pair.psd',
  'clarify-740-platinum-select': 'pss740_platinum_select.psd',
  'clarify-940-platinum': 'ps940_series.psd',
  'clarify-2040-platinum': 'ps2040_sereis.psd',

  // SIEVA
  'sieva-100': 'nb100_series.psd',
  'sieva-550': 'hc550_series.psd',
  'sieva-650': 'mc650_series.psd',
  'sieva-max-out': 'maxout_series.psd',

  // TORRENT
  'torrent-600': 'dpu600_highflow.psd',
  'torrent-700': 'Torrent700_series.psd',

  // STRATA
  'strata-37': 'strata 37.psd',
  'strata-60': 'strata 60.psd',
  'strata-emerald-240': 'es240_series.psd',
  'strata-emerald-740': 'es700_series.psd',

  // CYPHON
  'cyphon-28': 'Downloaded_Images/Cyphon_28.jpg',
  'cyphon-45': 'Downloaded_Images/Cyphon_45.jpg',
  'cyphon-47': 'Downloaded_Images/Cyphon_47.jpg',
  'cyphon-54': 'Cyphon 54_IMG_1247.psd',
  'cyphon-55': 'cg55_series.psd',
  'cyphon-60': 'cg60_series.psd',
  'cyphon-64': 'cyphon 64.psd',

  // TERSUS
  'tersus-380': 'Downloaded_Images/Tersus_380.jpg',
  'tersus-450': 'Tersus450.psd',
  'tersus-460': 'tersus 460_full.psd',
  'tersus-530': 'Tersus 530_IMG1282.psd',
  'tersus-600': 'Terusu600.psd',

  // SEPRUM
  'seprum-450': 'Downloaded_Images/Seprum_450.jpg',
  'seprum-460': 'Seprum 460_img1733.psd',
  'seprum-540': 'Seprum 540_IMG_1247.psd',
};

async function updateProductImages() {
  console.log('Starting product image update...\n');

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const [productSlug, imagePath] of Object.entries(productImageMap)) {
    try {
      // Check if file exists
      const fullPath = path.join(LOCAL_IMAGE_BASE, imagePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`❌ File not found: ${imagePath} for product ${productSlug}`);
        notFound++;
        continue;
      }

      // Update database
      const result = await query(
        `UPDATE products
         SET image_path = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name`,
        [imagePath, productSlug]
      );

      if (result.length > 0) {
        console.log(`✅ Updated ${result[0].name} (${productSlug}) → ${imagePath}`);
        updated++;
      } else {
        console.log(`⚠️  Product not found in database: ${productSlug}`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${productSlug}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Summary:`);
  console.log(`  ✅ Successfully updated: ${updated}`);
  console.log(`  ⚠️  Not found: ${notFound}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(60));
}

// Run the update
updateProductImages()
  .then(() => {
    console.log('\n✨ Product image update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
