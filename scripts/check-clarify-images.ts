import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function checkClarifyImages() {
  try {
    const products = await query(`
      SELECT p.id, p.name, p.slug, p.image_path, pl.title as product_line
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      WHERE pl.slug = 'clarify'
      ORDER BY p.display_order ASC
    `);

    console.log('CLARIFY Products in Database:\n');

    for (const p of products as any[]) {
      console.log(`${p.name}`);
      console.log(`  Slug: ${p.slug}`);
      console.log(`  Current image_path: ${p.image_path}`);
      console.log('');
    }

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

checkClarifyImages();
