import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function listProductLines() {
  try {
    const productLines = await query(`
      SELECT pl.id, pl.title, pl.slug, c.title as category, c.code
      FROM product_lines pl
      JOIN categories c ON pl.category_id = c.id
      ORDER BY c.display_order, pl.display_order
    `);

    console.log('Product Lines:\n');
    productLines.forEach((pl: any) => {
      console.log(`- ${pl.title} (${pl.slug}) in ${pl.category} (${pl.code})`);
    });

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

listProductLines();
