import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function checkVessels() {
  try {
    const vessels = await query(`
      SELECT p.id, p.name, p.image_path, pl.slug as product_line_slug, pl.title as product_line_title
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      WHERE p.name LIKE '%Vessel%'
      ORDER BY p.name
    `);

    console.log('Vessel Products:\n');
    vessels.forEach((v: any) => {
      const hasImage = v.image_path && v.image_path.trim() !== '';
      console.log(`${hasImage ? '✅' : '❌'} ${v.name}`);
      console.log(`   Image: ${v.image_path || 'NULL'}`);
      console.log(`   Line: ${v.product_line_title} (${v.product_line_slug})`);
      console.log('');
    });

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

checkVessels();
