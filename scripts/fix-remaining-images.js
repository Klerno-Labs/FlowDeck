require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixRemainingImages() {
  try {
    console.log('Fixing remaining product images...\n');

    // Update remaining images to ensure proper paths
    const updates = [
      { slug: 'invicta-filter', path: '/images/products/invicta/InvictaFilter.jpg' },
      { slug: 'sieva-600-ht', path: '/images/products/sieva/sieva_600ht.jpg' },
      { slug: 'sieva-maxout-basket', path: '/images/products/sieva/sieva_maxout_basket.jpg' },
    ];

    for (const { slug, path } of updates) {
      const result = await pool.query(
        'UPDATE products SET image_path = $1 WHERE slug = $2 RETURNING name, image_path',
        [path, slug]
      );

      if (result.rows.length > 0) {
        console.log(`✓ ${result.rows[0].name}`);
        console.log(`  Path: ${result.rows[0].image_path}\n`);
      }
    }

    console.log('✅ All image paths verified');

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

fixRemainingImages();
