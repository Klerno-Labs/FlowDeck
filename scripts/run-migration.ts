/**
 * Migration Runner
 * Safely runs the content versioning migration
 */

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables BEFORE importing client
config({ path: path.join(__dirname, '..', '.env.local') });

async function runMigration() {
  // Import client after env is loaded
  const { query, queryOne, closePool } = await import('../src/lib/db/client');
  try {
    console.log('🔍 Checking if migration is needed...');

    // Check if tables exist
    const checkResult = await queryOne<{ drafts_exists: boolean; versions_exists: boolean }>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'content_drafts'
      ) as drafts_exists,
      EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'content_versions'
      ) as versions_exists`
    );

    if (checkResult && checkResult.drafts_exists && checkResult.versions_exists) {
      console.log('✅ Migration already applied. Tables exist.');
      await closePool();
      process.exit(0);
      return;
    }

    console.log('📝 Running migration: 003_add_content_versioning.sql');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '003_add_content_versioning.sql');
    let migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Remove everything after ROLLBACK SCRIPT marker
    const rollbackIndex = migrationSQL.indexOf('-- ============================================================================\n-- ROLLBACK SCRIPT');
    if (rollbackIndex > 0) {
      migrationSQL = migrationSQL.substring(0, rollbackIndex);
    }

    // Execute entire migration as one transaction
    // PostgreSQL will handle statement ordering correctly
    await query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Created tables:');
    console.log('  - content_drafts');
    console.log('  - content_versions');
    console.log('');

    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await closePool();
    process.exit(1);
  }
}

runMigration();
