require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixAllProductImages() {
  try {
    console.log('Fixing all product images...\n');

    // Create TORRENT DPW placeholder if needed
    const torrentDir = path.join(process.cwd(), 'public', 'images', 'products', 'torrent');
    const dpwPath = path.join(torrentDir, 'torrent_dpw.jpg');
    if (!fs.existsSync(dpwPath)) {
      const sourcePath = path.join(torrentDir, 'torrent_600.jpg');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, dpwPath);
        console.log('✓ Created TORRENT DPW placeholder\n');
      }
    }

    // Comprehensive image mapping
    const imageMap = {
      // CLARIFY
      'clarify-250': '/images/products/clarify/Clarify250_B&W.png',
      'clarify-300': '/images/products/clarify/Clarify300_B&W.png',
      'clarify-380': '/images/products/clarify/Clarify380_B&W.png',
      'clarify-430': '/images/products/clarify/Clarify430_B&W.png',
      'clarify-500': '/images/products/clarify/Clarify500_B&W.png',
      'clarify-740-premium': '/images/products/clarify/pdp740_pair_full_B&W.png',
      'clarify-740-platinum-select': '/images/products/clarify/pss740_platinum_select_polypro_full_B&W.png',
      'clarify-740-platinum-select-nsf-ansi-61-certified': '/images/products/clarify/pss740_platinum_select_polypro_full_B&W.png',
      'clarify-940-platinum': '/images/products/clarify/ps940_series_cellulose_full_B&W.png',
      'clarify-2040-platinum': '/images/products/clarify/ps2040_sereis_full_cross_B&W.png',

      // SIEVA
      'sieva-100-series': '/images/products/sieva/sieva_100.jpg',
      'sieva-550-series': '/images/products/sieva/sieva_550.jpg',
      'sieva-600-ht-series': '/images/products/sieva/sieva_600ht.jpg',
      'sieva-650-series': '/images/products/sieva/sieva_650.jpg',
      'sieva-max-out-series': '/images/products/sieva/sieva_maxout.jpg',
      'sieva-max-out-basket': '/images/products/sieva/sieva_maxout_basket.jpg',

      // TORRENT
      'torrent-600-series': '/images/products/torrent/torrent_600.jpg',
      'torrent-700-series': '/images/products/torrent/torrent_700.jpg',
      'torrent-dpw-series': '/images/products/torrent/torrent_dpw.jpg',

      // INVICTA
      'invicta-filter': '/images/products/invicta/InvictaFilter.jpg',

      // STRATA
      'strata-37-series': '/images/products/strata/strata_37_B&W.png',
      'strata-60-series': '/images/products/strata/strata_60_B&W.png',
      'strata-emerald-240-series': '/images/products/strata/strata_emerald_240_B&W.png',
      'strata-emerald-740-series': '/images/products/strata/strata_emerald_740_B&W.png',

      // CYPHON
      'cyphon-28-series': '/images/products/cyphon/cyphon_28_B&W.png',
      'cyphon-45-series': '/images/products/cyphon/cyphon_45_B&W.png',
      'cyphon-47-series': '/images/products/cyphon/cyphon_47_B&W.png',
      'cyphon-55-series': '/images/products/cyphon/cyphon_55_B&W.png',
      'cyphon-60-series': '/images/products/cyphon/cyphon_60_B&W.png',

      // TERSUS
      'tersus-380-series': '/images/products/tersus/tersus_380_B&W.png',
      'tersus-450-series': '/images/products/tersus/tersus_450_B&W.png',
      'tersus-600-series': '/images/products/tersus/tersus_600_B&W.png',

      // SEPRUM
      'seprum-450-series': '/images/products/seprum/seprum_450_B&W.png',

      // VESSELS
      'clarify-vessels': '/images/products/vessels/clarify_vessels.jpg',
      'sieva-vessels': '/images/products/vessels/sieva_vessels.jpg',
      'torrent-vessels': '/images/products/vessels/torrent_vessels.jpg',
      'invicta-vessels': '/images/products/vessels/invicta_vessels.jpg',
      'strata-coalescer-vessels': '/images/products/vessels/strata_coalescer.jpg',
      'strata-emerald-absorption-vessels': '/images/products/vessels/strata_emerald_absorption.jpg',
      'cyphon-coalescer-vessels': '/images/products/vessels/cyphon_coalescer.jpg',
      'tersus-gas-filtration-vessels': '/images/products/vessels/tersus_gas_filtration.jpg',
      'seprum-gas-filtration-vessels': '/images/products/vessels/seprum_gas_filtration.jpg',
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

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

fixAllProductImages();
