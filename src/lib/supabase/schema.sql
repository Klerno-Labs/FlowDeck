-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE INDEX idx_users_email ON users(email);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  product_id TEXT,
  pdf_content_ids JSONB,
  status TEXT CHECK (status IN ('sent', 'failed', 'bounced')) DEFAULT 'sent',
  resend_email_id TEXT,
  error_message TEXT,
  metadata JSONB
);

-- Create indexes for email_logs
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_sender ON email_logs(sender_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_product ON email_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_email TEXT NOT NULL,
  recipient_email TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  product_id TEXT,
  status TEXT CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  qstash_schedule_id TEXT
);

-- Create indexes for reminders
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_email);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

-- Analytics events table (optional - for tracking usage)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_email TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT
);

-- Create indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_email);

-- Comments
COMMENT ON TABLE email_logs IS 'Tracks all emails sent through the system with PDFs';
COMMENT ON TABLE reminders IS 'Scheduled reminder emails for salespeople';
COMMENT ON TABLE analytics_events IS 'Optional usage analytics and tracking';
