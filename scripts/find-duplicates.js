require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function findDuplicates() {
  try {
    console.log('Searching for duplicate products...\n');

    // 1. Duplicate slugs
    console.log('=== DUPLICATE SLUGS ===');
    const duplicateSlugs = await pool.query(`
      SELECT slug, COUNT(*) as count, STRING_AGG(name, ', ') as products
      FROM products
      GROUP BY slug
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (duplicateSlugs.rows.length > 0) {
      for (const row of duplicateSlugs.rows) {
        console.log(`❌ Slug "${row.slug}" used ${row.count} times:`);
        console.log(`   Products: ${row.products}\n`);
      }
    } else {
      console.log('✓ No duplicate slugs found\n');
    }

    // 2. Duplicate names
    console.log('=== DUPLICATE NAMES ===');
    const duplicateNames = await pool.query(`
      SELECT name, COUNT(*) as count, STRING_AGG(slug, ', ') as slugs
      FROM products
      GROUP BY name
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (duplicateNames.rows.length > 0) {
      for (const row of duplicateNames.rows) {
        console.log(`❌ Name "${row.name}" used ${row.count} times:`);
        console.log(`   Slugs: ${row.slugs}\n`);
      }
    } else {
      console.log('✓ No duplicate names found\n');
    }

    // 3. Duplicate image paths
    console.log('=== DUPLICATE IMAGE PATHS ===');
    const duplicateImages = await pool.query(`
      SELECT image_path, COUNT(*) as count, STRING_AGG(name, ', ') as products
      FROM products
      WHERE image_path IS NOT NULL AND image_path != ''
      GROUP BY image_path
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (duplicateImages.rows.length > 0) {
      for (const row of duplicateImages.rows) {
        console.log(`⚠️  Image "${row.image_path}" used ${row.count} times:`);
        console.log(`   Products: ${row.products}\n`);
      }
    } else {
      console.log('✓ No duplicate image paths found\n');
    }

    // 4. Products with same name in same product line
    console.log('=== SAME NAME IN SAME PRODUCT LINE ===');
    const sameLineNames = await pool.query(`
      SELECT p1.name, pl.title as product_line, COUNT(*) as count
      FROM products p1
      JOIN product_lines pl ON p1.product_line_id = pl.id
      GROUP BY p1.name, pl.title, p1.product_line_id
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (sameLineNames.rows.length > 0) {
      for (const row of sameLineNames.rows) {
        console.log(`❌ "${row.name}" appears ${row.count} times in ${row.product_line}\n`);
      }
    } else {
      console.log('✓ No duplicate names in same product line\n');
    }

    // 5. Products with missing images
    console.log('=== PRODUCTS WITH MISSING/INVALID IMAGES ===');
    const missingImages = await pool.query(`
      SELECT p.name, p.slug, p.image_path, pl.title as product_line
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      WHERE p.image_path IS NULL
         OR p.image_path = ''
         OR p.image_path NOT LIKE '/images/%'
      ORDER BY pl.title, p.name
    `);

    if (missingImages.rows.length > 0) {
      for (const row of missingImages.rows) {
        console.log(`⚠️  ${row.product_line} > ${row.name}`);
        console.log(`   Slug: ${row.slug}`);
        console.log(`   Image: ${row.image_path || 'NULL'}\n`);
      }
    } else {
      console.log('✓ All products have valid image paths\n');
    }

    // Summary
    console.log('=== SUMMARY ===');
    console.log(`Duplicate slugs: ${duplicateSlugs.rows.length}`);
    console.log(`Duplicate names: ${duplicateNames.rows.length}`);
    console.log(`Duplicate images: ${duplicateImages.rows.length}`);
    console.log(`Same name in same line: ${sameLineNames.rows.length}`);
    console.log(`Missing/invalid images: ${missingImages.rows.length}`);

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

findDuplicates();
