-- ==========================================
-- P1 SESSION TRACKING MIGRATION
-- Adds device tracking and session management
-- ==========================================

-- Sessions table for device tracking
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT, -- 'desktop', 'tablet', 'mobile', 'unknown'
  browser TEXT,
  os TEXT,
  is_current BOOLEAN DEFAULT false,
  revoked BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_revoked ON sessions(revoked) WHERE revoked = false;

-- Clean up expired sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_sessions() RETURNS void AS $$
BEGIN
  DELETE FROM sessions
  WHERE expires_at < CURRENT_TIMESTAMP OR revoked = true;
END;
$$ LANGUAGE plpgsql;

-- Update last_active timestamp trigger
CREATE OR REPLACE FUNCTION update_session_last_active() RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_last_active
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_active();
