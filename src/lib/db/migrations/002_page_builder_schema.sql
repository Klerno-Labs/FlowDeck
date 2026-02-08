-- Migration: Page Builder Schema
-- Visual page builder for drag-and-drop editing

-- Page Configurations Table
CREATE TABLE IF NOT EXISTS page_configs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page_key TEXT NOT NULL UNIQUE, -- e.g., 'intro-presentation', 'products', 'knowledge-base'
  page_title TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{"elements": [], "styles": {}}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  published_by TEXT REFERENCES users(id)
);

-- Page Config History (version control)
CREATE TABLE IF NOT EXISTS page_config_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page_config_id TEXT NOT NULL REFERENCES page_configs(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT REFERENCES users(id),
  notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_configs_key ON page_configs(page_key);
CREATE INDEX IF NOT EXISTS idx_page_configs_published ON page_configs(is_published);
CREATE INDEX IF NOT EXISTS idx_page_config_history_page ON page_config_history(page_config_id, version DESC);

-- Insert default page configurations
INSERT INTO page_configs (page_key, page_title, config, is_published)
VALUES
  ('intro-presentation', 'Intro Presentation', '{"elements": [], "styles": {"backgroundColor": "bg-gradient-to-br from-gray-50 to-gray-100"}}'::jsonb, true),
  ('intro-what-we-guarantee', 'What We Guarantee', '{"elements": [], "styles": {"backgroundColor": "bg-gradient-to-br from-gray-50 to-gray-100"}}'::jsonb, true),
  ('products-main', 'Products Main', '{"elements": [], "styles": {"backgroundColor": "bg-white"}}'::jsonb, true),
  ('products-liquid-solid', 'Liquid Solid Category', '{"elements": [], "styles": {"backgroundColor": "#F17A2C"}}'::jsonb, true),
  ('products-liquid-liquid', 'Liquid Liquid Category', '{"elements": [], "styles": {"backgroundColor": "#00B4D8"}}'::jsonb, true),
  ('products-gas-liquid', 'Gas Liquid Category', '{"elements": [], "styles": {"backgroundColor": "#4169E1"}}'::jsonb, true),
  ('products-gas-solid', 'Gas Solid Category', '{"elements": [], "styles": {"backgroundColor": "#7AC142"}}'::jsonb, true),
  ('knowledge-base', 'Knowledge Base', '{"elements": [], "styles": {"backgroundColor": "bg-white"}}'::jsonb, true)
ON CONFLICT (page_key) DO NOTHING;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_page_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_page_configs_updated_at ON page_configs;

CREATE TRIGGER update_page_configs_updated_at
    BEFORE UPDATE ON page_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_page_config_updated_at();
