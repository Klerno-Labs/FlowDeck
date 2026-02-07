require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateClarifyPaths() {
  try {
    // Image mapping: product slug -> actual file name
    const imageMap = {
      'clarify-250': 'Clarify250_B&W.png',
      'clarify-300': 'Clarify300_B&W.png',
      'clarify-380': 'Clarify380_B&W.png',
      'clarify-430': 'Clarify430_B&W.png',
      'clarify-500': 'Clarify500_B&W.png',
      'clarify-740-premium': 'pdp740_pair_full_B&W.png',
      'clarify-740-platinum-select': 'pss740_platinum_select_polypro_full_B&W.png',
      'clarify-740-platinum-select-nsf': 'pss740_platinum_select_polypro_full_B&W.png',
      'clarify-940-platinum': 'ps940_series_cellulose_full_B&W.png',
      'clarify-2040-platinum': 'ps2040_sereis_full_cross_B&W.png',
    };

    console.log('Updating database image paths...\n');

    // Update each product's image path
    for (const [slug, filename] of Object.entries(imageMap)) {
      const imagePath = `/images/products/clarify/${filename}`;

      const result = await pool.query(
        `UPDATE products
         SET image_path = $1
         WHERE slug = $2
         RETURNING name`,
        [imagePath, slug]
      );

      if (result.rows.length > 0) {
        console.log(`✓ ${result.rows[0].name} -> ${filename}`);
      } else {
        console.log(`✗ Product not found: ${slug}`);
      }
    }

    console.log('\n✓ All CLARIFY image paths updated!');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

updateClarifyPaths();
