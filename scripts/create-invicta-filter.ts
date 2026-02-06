import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function createInvictaFilter() {
  console.log('Creating INVICTA Filter product...\n');

  try {
    // 1. Find INVICTA product line
    const productLine = await query(
      "SELECT id FROM product_lines WHERE title = 'INVICTA'"
    );

    if (productLine.length === 0) {
      console.log('❌ INVICTA product line not found');
      await closePool();
      return;
    }

    const lineId = productLine[0].id;

    // 2. Create INVICTA Filter product
    const result = await query(
      `INSERT INTO products (product_line_id, name, slug, image_path, display_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name`,
      [lineId, 'INVICTA Filter', 'invicta-filter', '/images/products/invicta/InvictaFilter.jpg', 1]
    );

    console.log(`✅ Created: ${result[0].name}`);
    console.log(`   ID: ${result[0].id}`);
    console.log(`   Image: /images/products/invicta/InvictaFilter.jpg`);

    // 3. Delete old incorrect INVICTA AB series products
    const deleted = await query(
      `DELETE FROM products
       WHERE name IN ('INVICTA AB Series', 'INVICTA AB500 Series', 'INVICTA ABP Series', 'INVICTA ABY Series')
       RETURNING name`
    );

    if (deleted.length > 0) {
      console.log(`\n✅ Deleted ${deleted.length} incorrect AB series products:`);
      deleted.forEach((p: any) => console.log(`   - ${p.name}`));
    }

    await closePool();
  } catch (error) {
    console.error('❌ Error:', error);
    await closePool();
    process.exit(1);
  }
}

createInvictaFilter()
  .then(() => {
    console.log('\n✨ INVICTA filter created successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
