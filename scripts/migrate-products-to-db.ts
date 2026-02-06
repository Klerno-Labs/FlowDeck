/**
 * Data Migration Script: Product Specs to PostgreSQL
 * Migrates all product data from productSpecs.ts to the database
 *
 * Run with: npx tsx scripts/migrate-products-to-db.ts
 */

import { Pool } from 'pg';
import { productSpecs } from '../src/data/productSpecs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Category definitions
const CATEGORIES = [
  { code: 'LS', title: 'LIQUID | SOLID', slug: 'liquid-solid', background_color: '#F17A2C', subtitle: 'FILTRATION', order: 1 },
  { code: 'LL', title: 'LIQUID | LIQUID', slug: 'liquid-liquid', background_color: '#00B4D8', subtitle: 'SEPARATION', order: 2 },
  { code: 'GL', title: 'GAS | LIQUID', slug: 'gas-liquid', background_color: '#4169E1', subtitle: 'SEPARATION', order: 3 },
  { code: 'GS', title: 'GAS | SOLID', slug: 'gas-solid', background_color: '#7AC142', subtitle: 'FILTRATION', order: 4 },
];

// Product line definitions with category mapping
const PRODUCT_LINES = [
  { slug: 'clarify', title: 'CLARIFY', category: 'liquid-solid', order: 1 },
  { slug: 'sieva', title: 'SIEVA', category: 'liquid-solid', order: 2 },
  { slug: 'torrent', title: 'TORRENT', category: 'liquid-solid', order: 3 },
  { slug: 'invicta', title: 'INVICTA', category: 'liquid-solid', order: 4 },
  { slug: 'strata', title: 'STRATA', category: 'liquid-liquid', order: 1 },
  { slug: 'cyphon', title: 'CYPHON', category: 'gas-liquid', order: 1 },
  { slug: 'tersus', title: 'TERSUS', category: 'gas-solid', order: 1 },
  { slug: 'seprum', title: 'SEPRUM', category: 'gas-solid', order: 2 },
];

async function migrate() {
  console.log('🚀 Starting product data migration...\n');

  try {
    // Step 1: Migrate Categories
    console.log('📦 Step 1: Creating categories...');
    const categoryMap = new Map<string, string>();

    for (const cat of CATEGORIES) {
      const result = await pool.query(
        `INSERT INTO categories (code, title, slug, background_color, subtitle, display_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE
         SET code = EXCLUDED.code, title = EXCLUDED.title, background_color = EXCLUDED.background_color
         RETURNING id`,
        [cat.code, cat.title, cat.slug, cat.background_color, cat.subtitle, cat.order]
      );
      categoryMap.set(cat.slug, result.rows[0].id);
      console.log(`   ✓ Created category: ${cat.title} (${cat.code})`);
    }

    // Step 2: Migrate Product Lines
    console.log('\n📂 Step 2: Creating product lines...');
    const productLineMap = new Map<string, string>();

    for (const line of PRODUCT_LINES) {
      const categoryId = categoryMap.get(line.category);
      if (!categoryId) {
        console.error(`   ❌ Category not found for ${line.title}`);
        continue;
      }

      const result = await pool.query(
        `INSERT INTO product_lines (category_id, title, slug, display_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
         SET title = EXCLUDED.title, display_order = EXCLUDED.display_order
         RETURNING id`,
        [categoryId, line.title, line.slug, line.order]
      );
      productLineMap.set(line.slug, result.rows[0].id);
      console.log(`   ✓ Created product line: ${line.title}`);
    }

    // Step 3: Migrate Products with Specifications
    console.log('\n🔧 Step 3: Creating products and specifications...');
    let productsCreated = 0;
    let specsCreated = 0;

    for (const [productId, productData] of Object.entries(productSpecs)) {
      // Determine product line from productId slug
      // e.g., 'clarify-250' -> 'clarify'
      const productLineSlug = productId.split('-')[0];
      const productLineId = productLineMap.get(productLineSlug);

      if (!productLineId) {
        console.error(`   ❌ Product line not found for product: ${productId}`);
        continue;
      }

      // Generate display order from productId index
      const displayOrder = Object.keys(productSpecs).indexOf(productId) + 1;

      // Create product
      const productResult = await pool.query(
        `INSERT INTO products (product_line_id, name, slug, image_path, display_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name, image_path = EXCLUDED.image_path, display_order = EXCLUDED.display_order
         RETURNING id`,
        [productLineId, productData.name, productId, productData.image || null, displayOrder]
      );

      const dbProductId = productResult.rows[0].id;
      productsCreated++;

      // Delete existing specifications for this product (for clean migration)
      await pool.query('DELETE FROM product_specifications WHERE product_id = $1', [dbProductId]);

      // Create specifications
      if (productData.specs) {
        let specOrder = 1;
        for (const [key, value] of Object.entries(productData.specs)) {
          // Convert value to JSON string for storage
          const specValue = JSON.stringify(value);

          await pool.query(
            `INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order)
             VALUES ($1, $2, $3, $4)`,
            [dbProductId, key, specValue, specOrder]
          );

          specsCreated++;
          specOrder++;
        }
      }

      console.log(`   ✓ Created: ${productData.name} with ${Object.keys(productData.specs || {}).length} specs`);
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`\n📊 Summary:`);
    console.log(`   • Categories: ${categoryMap.size}`);
    console.log(`   • Product Lines: ${productLineMap.size}`);
    console.log(`   • Products: ${productsCreated}`);
    console.log(`   • Specifications: ${specsCreated}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Start the dev server: npm run dev`);
    console.log(`   2. Visit http://localhost:3000/admin to manage products`);
    console.log(`   3. Changes will now be saved to database instead of code`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrate();
