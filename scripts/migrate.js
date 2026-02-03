/**
 * Database Migration Script
 * Runs the schema.sql file to create/update database tables
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('   Make sure .env.local exists with DATABASE_URL configured');
    process.exit(1);
  }

  console.log('🔄 Starting database migration...');
  console.log('📦 Database:', process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('📝 Creating tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

    console.log('   ✓ users table created');

    // Create email_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        sender_email TEXT NOT NULL,
        recipient_email TEXT NOT NULL,
        product_id TEXT,
        pdf_content_ids TEXT[],
        status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')) DEFAULT 'sent',
        resend_email_id TEXT,
        error_message TEXT
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status)`);

    console.log('   ✓ email_logs table created');

    // Create reminders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
        user_email TEXT NOT NULL,
        recipient_email TEXT,
        subject TEXT NOT NULL,
        message TEXT,
        product_id TEXT,
        status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')) DEFAULT 'pending',
        sent_at TIMESTAMP WITH TIME ZONE
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reminders_status_scheduled ON reminders(status, scheduled_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reminders_user_email ON reminders(user_email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders(scheduled_at)`);

    console.log('   ✓ reminders table created');

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Next step: Run the seed script to create the demo user');
    console.log('   node scripts/seed-user.js');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
