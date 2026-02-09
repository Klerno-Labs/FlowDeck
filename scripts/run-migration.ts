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
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by statement and execute
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('ROLLBACK SCRIPT')) break; // Stop before rollback section
      if (statement.length > 10) { // Skip very short statements
        await query(statement + ';');
      }
    }

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
