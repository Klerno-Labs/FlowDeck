import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function listProductImages() {
  try {
    const products = await query(`
      SELECT p.id, p.name, p.image_path, pl.title as product_line
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      ORDER BY p.name
    `);

    console.log('\n=== ALL PRODUCTS AND THEIR IMAGES ===\n');

    let missing = 0;
    let assigned = 0;

    products.forEach((p: any) => {
      const status = p.image_path ? '✅' : '❌';
      const img = p.image_path || 'MISSING IMAGE';

      if (!p.image_path) {
        missing++;
        console.log(`${status} ${p.name.padEnd(50)} | ${p.product_line.padEnd(20)} | ${img}`);
      } else {
        assigned++;
      }
    });

    console.log('\n=== PRODUCTS WITHOUT IMAGES ===\n');
    const missingProducts = products.filter((p: any) => !p.image_path);
    missingProducts.forEach((p: any) => {
      console.log(`- ${p.name} (${p.product_line})`);
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total products: ${products.length}`);
    console.log(`With images: ${assigned}`);
    console.log(`Missing images: ${missing}`);

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listProductImages();
