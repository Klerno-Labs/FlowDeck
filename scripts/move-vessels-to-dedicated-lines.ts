import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { query, closePool } from '../src/lib/db/client';

async function moveVesselsToDedicatedLines() {
  console.log('Creating dedicated Vessels product lines and moving vessels...\n');

  try {
    // 1. Get category IDs
    const categories = await query('SELECT id, code, title FROM categories ORDER BY display_order');
    const categoryMap = new Map(categories.map((c: any) => [c.code, { id: c.id, title: c.title }]));

    // 2. Create "Vessels" product line for each category
    console.log('=== Creating Vessels Product Lines ===');
    const vesselsLineMap = new Map();

    for (const [code, { id, title }] of categoryMap) {
      // Check if vessels product line already exists for this category
      const existing = await query(
        'SELECT id FROM product_lines WHERE slug = $1 AND category_id = $2',
        [`vessels-${code.toLowerCase()}`, id]
      );

      if (existing.length > 0) {
        console.log(`✓ Vessels product line already exists for ${title} (${code})`);
        vesselsLineMap.set(code, existing[0].id);
      } else {
        const result = await query(
          `INSERT INTO product_lines (category_id, title, slug, display_order)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [id, 'Vessels', `vessels-${code.toLowerCase()}`, 99] // High display_order to show last
        );
        console.log(`✅ Created Vessels product line for ${title} (${code})`);
        vesselsLineMap.set(code, result[0].id);
      }
    }

    // 3. Define vessel products and their target category
    const vesselMappings = [
      // LS (LIQUID | SOLID) vessels
      { id: '1fc68c57-e668-44b8-97a8-87a248d135ec', name: 'Clarify Cartridge Filter Vessels', category: 'LS' },
      { id: '8209b01a-94ee-4d68-8acd-d0afec295076', name: 'Sieva Bag Filter Vessels', category: 'LS' },
      { id: 'f6efef25-0aa3-4765-8897-a5cbff279640', name: 'Torrent High Flow Vessels', category: 'LS' },
      { id: '0f5a8ab8-c2a2-487b-a28c-4abf636d61a9', name: 'Invicta Filter Vessels', category: 'LS' },

      // LL (LIQUID | LIQUID) vessels
      { id: '626a0484-639d-451b-a568-3c446df650ea', name: 'STRATA Emerald Hydrocarbon Absorption Vessels', category: 'LL' },
      { id: '9c4e9eb2-4d99-4886-8e21-fb1bf60116d5', name: 'STRATA Liquid-Liquid Coalescer Vessels', category: 'LL' },

      // GL (GAS | LIQUID) vessels
      { id: '79562149-c205-4669-aa69-77e80816d2c0', name: 'CYPHON Gas Coalescer Vessels', category: 'GL' },

      // GS (GAS | SOLID) vessels
      { id: '3841f620-a4f3-4555-a277-da1888df6319', name: 'TERSUS Gas Filtration Vessels', category: 'GS' },
      { id: '431b00d2-fbd8-4ffb-80ba-8d2a0aadb54a', name: 'SEPRUM Gas Filtration Vessels', category: 'GS' },
    ];

    // 4. Move vessels to their appropriate product lines
    console.log('\n=== Moving Vessels to Dedicated Product Lines ===');

    for (const vessel of vesselMappings) {
      const targetLineId = vesselsLineMap.get(vessel.category);

      if (!targetLineId) {
        console.log(`❌ No vessels line found for category ${vessel.category}`);
        continue;
      }

      await query(
        'UPDATE products SET product_line_id = $1, updated_at = NOW() WHERE id = $2',
        [targetLineId, vessel.id]
      );

      console.log(`✅ Moved: ${vessel.name} → Vessels (${vessel.category})`);
    }

    // 5. Show summary
    console.log('\n=== Summary ===');
    for (const [code, lineId] of vesselsLineMap) {
      const count = await query(
        'SELECT COUNT(*) as count FROM products WHERE product_line_id = $1',
        [lineId]
      );
      console.log(`${categoryMap.get(code)?.title} (${code}) Vessels: ${count[0].count} products`);
    }

    await closePool();
  } catch (error) {
    console.error('❌ Error:', error);
    await closePool();
    process.exit(1);
  }
}

moveVesselsToDedicatedLines()
  .then(() => {
    console.log('\n✨ Vessels moved successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
