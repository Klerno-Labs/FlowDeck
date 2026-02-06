import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function updateAllVessels() {
  console.log('Updating ALL vessel products with correct images...\n');

  // Map of vessel product names to their image paths
  const vesselMappings = [
    {
      name: 'Clarify Cartridge Filter Vessels',
      image: '/images/products/vessels/clarify_vessels.jpg'
    },
    {
      name: 'SIEVA Bag Filter Vessels',
      image: '/images/products/vessels/sieva_vessels.jpg'
    },
    {
      name: 'SIEVA Max-Out Basket',
      image: '/images/products/vessels/sieva_vessels.jpg' // Using same SIEVA vessels image
    },
    {
      name: 'Torrent High Flow Vessels',
      image: '/images/products/vessels/torrent_vessels.jpg'
    },
    {
      name: 'Invicta Filter Vessels',
      image: '/images/products/vessels/invicta_vessels.jpg'
    },
    {
      name: 'STRATA Emerald Hydrocarbon Absorption Vessels',
      image: '/images/products/vessels/strata_emerald_absorption.jpg'
    },
    {
      name: 'STRATA Liquid-Liquid Coalescer Vessels',
      image: '/images/products/vessels/strata_coalescer.jpg'
    },
    {
      name: 'CYPHON Gas Coalescer Vessels',
      image: '/images/products/vessels/cyphon_coalescer.jpg'
    },
    {
      name: 'TERSUS Gas Filtration Vessels',
      image: '/images/products/vessels/tersus_gas_filtration.jpg'
    },
    {
      name: 'SEPRUM Gas Filtration Vessels',
      image: '/images/products/vessels/seprum_gas_filtration.jpg'
    },
  ];

  let updated = 0;
  let notFound = 0;

  for (const mapping of vesselMappings) {
    try {
      const result = await query(
        `UPDATE products
         SET image_path = $1, updated_at = NOW()
         WHERE name = $2
         RETURNING id, name`,
        [mapping.image, mapping.name]
      );

      if (result.length > 0) {
        console.log(`✅ ${result[0].name}`);
        console.log(`   → ${mapping.image}`);
        updated++;
      } else {
        console.log(`⚠️  Product not found: ${mapping.name}`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${mapping.name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Summary:`);
  console.log(`  ✅ Successfully updated: ${updated} vessel products`);
  console.log(`  ⚠️  Not found: ${notFound}`);
  console.log('='.repeat(70));

  // List all products with images
  console.log('\n=== Checking All Products ===');
  const allProducts = await query(`
    SELECT COUNT(*) as total,
           COUNT(image_path) FILTER (WHERE image_path IS NOT NULL AND image_path != '') as with_images
    FROM products
  `);

  console.log(`Total products: ${allProducts[0].total}`);
  console.log(`Products with images: ${allProducts[0].with_images}`);
  console.log(`Products without images: ${allProducts[0].total - allProducts[0].with_images}`);

  await closePool();
}

updateAllVessels()
  .then(() => {
    console.log('\n✨ All vessels updated!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
