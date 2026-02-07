require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addProductLineLogos() {
  try {
    // Logo mapping: product line title (case insensitive) -> logo path
    const logoMap = {
      'clarify': '/logos/brands/ClarifyColor-Edited.png',
      'cyphon': '/logos/brands/CyphonColor-Edited.png',
      'invicta': '/logos/brands/InvictaColor.png',
      'seprum': '/logos/brands/SeprumColor-Edited.png',
      'sieva': '/logos/brands/SievaColor.png',
      'strata': '/logos/brands/StrataColor-Edited.png',
      'tersus': '/logos/brands/TersusColor.png',
      'torrent': '/logos/brands/TorrentColor.png',
    };

    console.log('Updating product line logos...\n');

    // Get all product lines
    const result = await pool.query('SELECT id, title, slug, logo_path FROM product_lines ORDER BY display_order ASC');

    for (const line of result.rows) {
      const titleLower = line.title.toLowerCase();
      const logoPath = logoMap[titleLower];

      if (logoPath) {
        await pool.query(
          'UPDATE product_lines SET logo_path = $1 WHERE id = $2',
          [logoPath, line.id]
        );
        console.log(`✓ ${line.title} -> ${logoPath}`);
      } else if (line.title !== 'Vessels') {
        console.log(`⚠ ${line.title} -> No logo found (skipped)`);
      }
    }

    console.log('\n✓ Product line logos updated!');
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

addProductLineLogos();
