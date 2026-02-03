-- ==========================================
-- 3-TIER ROLE SYSTEM MIGRATION
-- Dev → Admin → Sales Team
-- ==========================================

-- Update role enum to support new tiers
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new role constraint with dev, admin, sales
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('dev', 'admin', 'sales'));

-- Add created_by column to track who created each user
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by TEXT REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);
