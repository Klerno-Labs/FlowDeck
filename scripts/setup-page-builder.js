/**
 * Setup Page Builder Database Tables
 * Runs the page builder migration to create necessary tables
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function setupPageBuilder() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔧 Setting up Page Builder database tables...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../src/lib/db/migrations/002_page_builder_schema.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');

    // Run the migration
    await pool.query(migration);

    console.log('✅ Page Builder tables created successfully!');
    console.log('\nTables created:');
    console.log('  - page_configs');
    console.log('  - page_config_history');
    console.log('\nDefault pages inserted:');
    console.log('  - Intro Presentation');
    console.log('  - What We Guarantee');
    console.log('  - Products Main');
    console.log('  - Liquid Solid Category');
    console.log('  - Liquid Liquid Category');
    console.log('  - Gas Liquid Category');
    console.log('  - Gas Solid Category');
    console.log('  - Knowledge Base');
    console.log('\n🎉 Page Builder is ready to use!');
    console.log('Navigate to: /admin/page-builder\n');

  } catch (error) {
    console.error('❌ Error setting up Page Builder:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check that DATABASE_URL is set in .env.local');
    console.error('  2. Ensure database is accessible');
    console.error('  3. Check that users table exists (run user migration first)');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupPageBuilder();
