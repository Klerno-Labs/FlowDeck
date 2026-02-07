import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';
import fs from 'fs';

async function verifyVesselImages() {
  try {
    const vessels = await query(`
      SELECT name, image_path
      FROM products
      WHERE name LIKE '%Vessel%'
      ORDER BY name
    `);

    console.log('Checking vessel image files:\n');

    for (const v of vessels as any[]) {
      const imagePath = v.image_path;
      if (!imagePath) {
        console.log(`❌ ${v.name}: No image path`);
        continue;
      }

      // Remove leading slash and construct full path
      const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      const exists = fs.existsSync(fullPath);

      console.log(`${exists ? '✅' : '❌'} ${v.name}`);
      console.log(`   DB Path: ${imagePath}`);
      console.log(`   File exists: ${exists}`);
      if (!exists) {
        console.log(`   Expected at: ${fullPath}`);
      }
      console.log('');
    }

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

verifyVesselImages();
