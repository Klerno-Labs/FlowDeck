import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function fixClarifyImages() {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'images', 'products', 'clarify');
    const baseImage = path.join(publicDir, 'Clarify430_B&W.png');

    // Image mapping: product slug -> actual file name
    const imageMap: Record<string, string> = {
      'clarify-250': 'Clarify250_B&W.png',
      'clarify-300': 'Clarify300_B&W.png',
      'clarify-380': 'Clarify380_B&W.png',
      'clarify-430': 'Clarify430_B&W.png',
      'clarify-500': 'Clarify500_B&W.png',
      'clarify-740-premium': 'pdp740_pair_full_B&W.png',
      'clarify-740-platinum-select': 'pss740_platinum_select_polypro_full_B&W.png',
      'clarify-740-platinum-select-nsf': 'pss740_platinum_select_polypro_full_B&W.png',
      'clarify-940-platinum': 'ps940_series_cellulose_full_B&W.png',
      'clarify-2040-platinum': 'ps2040_sereis_full_cross_B&W.png',
    };

    // Create placeholder images for missing products
    const missingImages = ['Clarify250_B&W.png', 'Clarify300_B&W.png', 'Clarify380_B&W.png', 'Clarify500_B&W.png'];

    console.log('Creating placeholder images...\n');
    for (const img of missingImages) {
      const targetPath = path.join(publicDir, img);
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(baseImage, targetPath);
        console.log(`✓ Created ${img}`);
      }
    }

    console.log('\nUpdating database image paths...\n');

    // Update each product's image path
    for (const [slug, filename] of Object.entries(imageMap)) {
      const imagePath = `/images/products/clarify/${filename}`;

      const result = await query(
        `UPDATE products
         SET image_path = $1
         WHERE slug = $2
         RETURNING name`,
        [imagePath, slug]
      );

      if (result.length > 0) {
        console.log(`✓ ${result[0].name} -> ${filename}`);
      }
    }

    console.log('\n✓ All CLARIFY images fixed!');
    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

fixClarifyImages();
