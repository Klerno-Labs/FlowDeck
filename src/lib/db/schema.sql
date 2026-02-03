-- FTC FlowDeck Database Schema
-- PostgreSQL Database Schema for Neon

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Email Logs Table
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
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Reminders Table
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
);

-- Create indexes for efficient reminder queries
CREATE INDEX IF NOT EXISTS idx_reminders_status_scheduled ON reminders(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user_email ON reminders(user_email);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders(scheduled_at);

-- Insert demo user (password: password123)
INSERT INTO users (id, email, password_hash, name, role, created_at)
VALUES (
  'demo-user-id',
  'demo@ftc.com',
  '$2a$10$YourBcryptHashHere',  -- This will be replaced by the seed script
  'Demo User',
  'admin',
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
