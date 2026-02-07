require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixAllImages() {
  try {
    console.log('Fixing all product images with correct slugs...\n');

    // Create placeholder for TORRENT DPW
    const torrentDir = path.join(process.cwd(), 'public', 'images', 'products', 'torrent');
    const dpwPath = path.join(torrentDir, 'torrent_dpw.jpg');
    if (!fs.existsSync(dpwPath)) {
      const sourcePath = path.join(torrentDir, 'torrent_600.jpg');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, dpwPath);
        console.log('✓ Created TORRENT DPW placeholder\n');
      }
    }

    // Correct image mapping based on actual slugs
    const imageMap = {
      // CLARIFY - Already fixed
      'clarify-740-nsf': '/images/products/clarify/pss740_platinum_select_polypro_full_B&W.png',

      // SIEVA
      'sieva-100': '/images/products/sieva/sieva_100.jpg',
      'sieva-550': '/images/products/sieva/sieva_550.jpg',
      'sieva-600-ht': '/images/products/sieva/sieva_600ht.jpg',
      'sieva-650': '/images/products/sieva/sieva_650.jpg',
      'sieva-maxout': '/images/products/sieva/sieva_maxout.jpg',
      'sieva-maxout-basket': '/images/products/sieva/sieva_maxout_basket.jpg',

      // TORRENT
      'torrent-600': '/images/products/torrent/torrent_600.jpg',
      'torrent-700': '/images/products/torrent/torrent_700.jpg',
      'torrent-dpw': '/images/products/torrent/torrent_dpw.jpg',

      // STRATA
      'strata-37': '/images/products/strata/strata_37_B&W.png',
      'strata-60': '/images/products/strata/strata_60_B&W.png',
      'strata-emerald-240': '/images/products/strata/strata_emerald_240_B&W.png',
      'strata-emerald-740': '/images/products/strata/strata_emerald_740_B&W.png',

      // CYPHON
      'cyphon-28': '/images/products/cyphon/cyphon_28_B&W.png',
      'cyphon-45': '/images/products/cyphon/cyphon_45_B&W.png',
      'cyphon-47': '/images/products/cyphon/cyphon_47_B&W.png',
      'cyphon-55': '/images/products/cyphon/cyphon_55_B&W.png',
      'cyphon-60': '/images/products/cyphon/cyphon_60_B&W.png',

      // TERSUS
      'tersus-380': '/images/products/tersus/tersus_380_B&W.png',
      'tersus-450': '/images/products/tersus/tersus_450_B&W.png',
      'tersus-600': '/images/products/tersus/tersus_600_B&W.png',

      // SEPRUM
      'seprum-450': '/images/products/seprum/seprum_450_B&W.png',

      // VESSELS (fix the one that was wrong)
      'cyphon-gas-coalescer-vessels': '/images/products/vessels/cyphon_coalescer.jpg',
    };

    let updated = 0;
    let notFound = 0;

    for (const [slug, imagePath] of Object.entries(imageMap)) {
      const result = await pool.query(
        'UPDATE products SET image_path = $1 WHERE slug = $2 RETURNING name',
        [imagePath, slug]
      );

      if (result.rows.length > 0) {
        console.log(`✓ ${result.rows[0].name} -> ${imagePath}`);
        updated++;
      } else {
        console.log(`✗ Product not found: ${slug}`);
        notFound++;
      }
    }

    console.log(`\n✓ Updated ${updated} product images`);
    if (notFound > 0) {
      console.log(`⚠ ${notFound} products not found in database`);
    }
    console.log('\n✅ All product images fixed!');

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

fixAllImages();
