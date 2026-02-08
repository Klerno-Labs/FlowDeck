-- Migration: Update user roles to support dev/admin/sales
-- Run this to update existing database

-- First, drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Update existing 'user' role to 'sales' and 'admin' stays 'admin'
UPDATE users SET role = 'sales' WHERE role = 'user';

-- Add the new constraint with dev/admin/sales roles
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('dev', 'admin', 'sales'));

-- Update the default role
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'sales';

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
