/**
 * Password Features Migration Script
 * Creates password_reset_tokens and password_history tables
 */

const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔄 Starting password features migration...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const sql = fs.readFileSync('./scripts/migrate-password-features.sql', 'utf-8');

    console.log('📝 Creating password reset and history tables...');
    await pool.query(sql);

    console.log('   ✓ password_reset_tokens table created');
    console.log('   ✓ password_history table created');
    console.log('   ✓ Cleanup functions created');
    console.log('\n✅ Password features migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
