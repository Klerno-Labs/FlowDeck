/**
 * Role System Migration Runner
 * Migrates database to support 3-tier role system
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔄 Running role system migration...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'migrate-roles.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the migration
    await pool.query(sql);

    console.log('✅ Role system migration completed successfully!');
    console.log('   • Updated role constraint to: dev, admin, sales');
    console.log('   • Added created_by column for user tracking');
    console.log('   • Created indexes for role-based queries');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
