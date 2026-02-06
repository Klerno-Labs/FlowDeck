/**
 * Corrected script to update product images with actual UUIDs and file paths
 * Run with: npx tsx --env-file=.env.local scripts/update-product-images-corrected.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';
import * as fs from 'fs';

const LOCAL_IMAGE_BASE = 'C:\\Users\\Somli\\OneDrive\\Desktop\\Flowdeck\\FTC\\Product';

// Complete product image mapping with actual UUIDs from database
const productImageMap: Record<string, string> = {
  // CLARIFY
  '992a2338-81e8-462e-b571-fab836f3d75a': 'ab_series_SOE_222_full.jpg', // CLARIFY 250
  'a0071489-db89-4cd6-bd64-6c4b464cdd29': 'abp_series_full_1.jpg', // CLARIFY 300
  '1ef5ccbf-215b-4c19-aa2c-870a3568b9bb': 'aby_series_full_2.jpg', // CLARIFY 380
  '5c564d21-b115-40e6-bacd-155fa995d174': 'Clarify430.jpg', // CLARIFY 430
  '59cf51d8-4eb4-462a-8a35-d2f6d4fbf463': 'ab500_series_pair_full.jpg', // CLARIFY 500
  '5161ebae-2415-4e63-9b47-8af7600d4f53': 'pdp740_pair_full.jpg', // CLARIFY 740 Premium
  '99e16f7e-a589-42b2-bce1-05563d4b4608': 'pss740_platinum_select_polypro_full.jpg', // CLARIFY 740 Platinum Select
  '215adbe6-3822-4d51-9ea2-59f407273982': 'pss740_platinum_select_polypro_full.jpg', // CLARIFY 740 Platinum Select NSF (same image)
  '7f34984f-8187-4341-b3b3-d28ce0de4283': 'ps940_series_cellulose_full.jpg', // CLARIFY 940 Platinum
  '98c8808e-ad2b-4d38-aca2-8b289cafaa8c': 'ps2040_sereis_full_cross.jpg', // CLARIFY 2040 Platinum

  // SIEVA
  '33a6c539-3364-45f6-9eae-55c4f08dcf5f': 'nb100_series_full.jpg', // SIEVA 100
  '7d4cb67b-9b24-4899-9298-05e837069c8d': 'hc550_series_full_badseal.jpg', // SIEVA 550
  '289adae8-c3ff-4ade-b364-a2ad4e54baa7': 'mc650_series_pair_full.jpg', // SIEVA 650
  'bee5de1c-d8a8-4edc-9e32-4e794e930c60': 'maxout_series_combo_full.jpg', // SIEVA Max Out

  // TORRENT
  'c88d24e8-2c62-469c-a540-37f0fb8a90b1': 'dpu600_highflow_family.jpg', // TORRENT 600
  '3f2d9584-58d2-4c14-93c3-bd38b7193175': 'dpw_series_full_filter.jpg', // TORRENT 700 (using DPW series image)
  '55b8aa94-dbcb-4601-84e9-ade99f6805a2': 'dpw_series_full_filter.jpg', // TORRENT DPW

  // STRATA
  '79ae6d18-5d4b-4858-b015-3d941ad281cd': 'strata 37.jpg', // STRATA 37
  'c2c5266e-b443-455a-b868-03d294a274ed': 'strata 60.jpg', // STRATA 60
  '70d0bd5f-4b9a-404d-83ac-686b47cb2bfb': 'es240_series_miniguzzler_full.jpg', // STRATA Emerald 240
  '5fe6a04a-752c-440e-b88b-5708e30dc67a': 'es700_series_oilguzzler_full.jpg', // STRATA Emerald 740

  // CYPHON
  '6f8550af-cacf-4a15-b36e-c6022326fdc1': 'Downloaded_Images/Cyphon_28.jpg', // CYPHON 28
  '0f817f67-41b9-4683-a09f-0097728948f3': 'Downloaded_Images/Cyphon_45.jpg', // CYPHON 45
  '9eb6e824-797c-4bd4-9059-97b8aaa9bea4': 'Downloaded_Images/Cyphon_47.jpg', // CYPHON 47
  '22bbed7b-1f31-4e1b-a121-4a525ca51bf4': 'cg55_series_full_.jpg', // CYPHON 55
  '8b09d6d7-7f39-43e5-bcf9-beaae597dab6': 'cg60_series_full.jpg', // CYPHON 60

  // TERSUS
  'd7faffb9-c970-498c-82f6-6d302c5a865d': 'Downloaded_Images/Tersus_380.jpg', // TERSUS 380
  'a1e5c3bb-1edb-441c-be53-c7c6afc0d14d': 'tersus 460_full.psd', // TERSUS 450 (using 460 image for now)
  '5d00e93b-4f7f-4bb5-b26a-3c142b8c23fd': 'tersus 460_full.psd', // TERSUS 600 (using 460 image for now)

  // SEPRUM
  '2522f010-c24e-4de6-b3ed-d9f7dee641e5': 'Downloaded_Images/Seprum_450.jpg', // SEPRUM 450
};

async function updateProductImages() {
  console.log('Starting product image update with corrected mappings...\n');

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const [productId, imagePath] of Object.entries(productImageMap)) {
    try {
      // Check if file exists
      const fullPath = path.join(LOCAL_IMAGE_BASE, imagePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`❌ File not found: ${imagePath}`);
        notFound++;
        continue;
      }

      // Get file size
      const stats = fs.statSync(fullPath);
      const sizeKB = Math.round(stats.size / 1024);

      // Update database
      const result = await query(
        `UPDATE products
         SET image_path = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, name`,
        [imagePath, productId]
      );

      if (result.length > 0) {
        console.log(`✅ Updated "${result[0].name}" → ${imagePath} (${sizeKB} KB)`);
        updated++;
      } else {
        console.log(`⚠️  Product not found: ${productId}`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${productId}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Summary:`);
  console.log(`  ✅ Successfully updated: ${updated}`);
  console.log(`  ⚠️  Not found: ${notFound}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(60));

  await closePool();
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
