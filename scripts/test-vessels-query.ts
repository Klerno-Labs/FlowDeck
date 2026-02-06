import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { getProductsByLineTitleAndCategory } from '../src/lib/db/products';
import { closePool } from '../src/lib/db/client';

async function testQuery() {
  try {
    console.log('Testing getProductsByLineTitleAndCategory...\n');

    const categories = ['liquid-solid', 'liquid-liquid', 'gas-liquid', 'gas-solid'];

    for (const category of categories) {
      console.log(`\n=== Category: ${category} ===`);
      const products = await getProductsByLineTitleAndCategory('Vessels', category);
      console.log(`Found ${products.length} vessels:`);
      products.forEach((p: any) => {
        console.log(`  - ${p.name}`);
        console.log(`    Image: ${p.image_path}`);
      });
    }

    await closePool();
  } catch (error) {
    console.error('Error:', error);
    await closePool();
    process.exit(1);
  }
}

testQuery();
