require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function listAllProducts() {
  try {
    const result = await pool.query(`
      SELECT p.slug, p.name, pl.title as product_line, p.image_path
      FROM products p
      JOIN product_lines pl ON p.product_line_id = pl.id
      ORDER BY pl.title, p.display_order
    `);

    console.log('\nAll Products in Database:\n');

    let currentLine = '';
    for (const row of result.rows) {
      if (row.product_line !== currentLine) {
        currentLine = row.product_line;
        console.log(`\n=== ${currentLine} ===`);
      }
      console.log(`  ${row.name}`);
      console.log(`    Slug: ${row.slug}`);
      console.log(`    Image: ${row.image_path || 'MISSING'}`);
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

listAllProducts();
