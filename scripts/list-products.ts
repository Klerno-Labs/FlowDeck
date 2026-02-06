import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function listProducts() {
  try {
    const products = await query(`
      SELECT p.id, p.name, pl.title as product_line, c.title as category
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      JOIN categories c ON pl.category_id = c.id
      ORDER BY c.display_order, pl.display_order, p.display_order
    `);

    console.log(`Found ${products.length} products:\n`);
    products.forEach((p: any) => {
      console.log(`${p.id.padEnd(30)} | ${p.name.padEnd(30)} | ${p.product_line} / ${p.category}`);
    });

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listProducts();
