require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateToColorImages() {
  try {
    console.log('Updating to color PNG images...\n');

    const imageMap = {
      // TORRENT - Color PNGs
      'torrent-600': '/images/products/torrent/torrent_600.png',
      'torrent-700': '/images/products/torrent/torrent_700.png',
      'torrent-dpw': '/images/products/torrent/torrent_dpw.png',

      // SIEVA - Color PNGs
      'sieva-100': '/images/products/sieva/sieva_100.png',
      'sieva-550': '/images/products/sieva/sieva_550.png',
      'sieva-650': '/images/products/sieva/sieva_650.png',
      'sieva-maxout': '/images/products/sieva/sieva_maxout.png',
    };

    let updated = 0;

    for (const [slug, imagePath] of Object.entries(imageMap)) {
      const result = await pool.query(
        'UPDATE products SET image_path = $1 WHERE slug = $2 RETURNING name',
        [imagePath, slug]
      );

      if (result.rows.length > 0) {
        console.log(`✓ ${result.rows[0].name} -> ${imagePath}`);
        updated++;
      }
    }

    console.log(`\n✓ Updated ${updated} products to color PNG images`);

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

updateToColorImages();
