/**
 * Database Migration Script
 * Runs all database migrations in order
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is not set');
    console.error('   Make sure .env.local exists with the database URL configured');
    process.exit(1);
  }

  console.log('🔄 Starting database migration...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('📝 Creating base tables...');

    // Create users table with 3-tier role system
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('dev', 'admin', 'sales')) DEFAULT 'sales',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE,
        last_failed_login TIMESTAMP WITH TIME ZONE,
        last_successful_login TIMESTAMP WITH TIME ZONE
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by)`);

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

    // Create audit_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        event_type TEXT NOT NULL,
        user_id TEXT,
        email TEXT,
        ip_address TEXT,
        user_agent TEXT,
        metadata JSONB,
        severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info'
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON audit_logs(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity)`);

    console.log('   ✓ audit_logs table created');

    // Create rate_limits table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        identifier TEXT NOT NULL UNIQUE,
        attempts INTEGER DEFAULT 0,
        blocked_until TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked_until ON rate_limits(blocked_until)`);

    console.log('   ✓ rate_limits table created');

    // Create password_reset_tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP WITH TIME ZONE
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at)`);

    console.log('   ✓ password_reset_tokens table created');

    // Create password_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_history (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON password_history(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_history_created_at ON password_history(created_at DESC)`);

    console.log('   ✓ password_history table created');

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ip_address TEXT,
        user_agent TEXT,
        device_type TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        invalidated BOOLEAN DEFAULT false
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity DESC)`);

    console.log('   ✓ sessions table created');

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Next step: Create your dev user');
    console.log('   node scripts/create-dev-user.js');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
