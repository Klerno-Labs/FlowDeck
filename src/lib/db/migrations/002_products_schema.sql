-- FlowDeck Products Schema Migration
-- Creates tables for categories, product lines, products, specifications, and change tracking
-- Note: Using TEXT for IDs to match existing users table structure

-- Categories table (LS, LL, GL, GS)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code VARCHAR(2) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  background_color VARCHAR(7) NOT NULL,
  subtitle VARCHAR(100),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id)
);

-- Product lines table (Clarify, Sieva, Torrent, etc.)
CREATE TABLE IF NOT EXISTS product_lines (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  logo_path VARCHAR(500),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_line_id TEXT NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image_path VARCHAR(500),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id)
);

-- Product specifications (key-value pairs for dynamic specs)
CREATE TABLE IF NOT EXISTS product_specifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Change tracking table (simple version for real-time updates)
CREATE TABLE IF NOT EXISTS content_changes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  table_name VARCHAR(50) NOT NULL,
  record_id TEXT NOT NULL,
  action VARCHAR(20) NOT NULL,
  changed_by TEXT REFERENCES users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_lines_category ON product_lines(category_id);
CREATE INDEX IF NOT EXISTS idx_products_line ON products(product_line_id);
CREATE INDEX IF NOT EXISTS idx_specs_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_changes_record ON content_changes(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_changes_timestamp ON content_changes(changed_at DESC);

-- Comments for documentation
COMMENT ON TABLE categories IS 'Product categories: LS, LL, GL, GS';
COMMENT ON TABLE product_lines IS 'Product lines (brands) within each category';
COMMENT ON TABLE products IS 'Individual products within product lines';
COMMENT ON TABLE product_specifications IS 'Dynamic key-value specifications for products';
COMMENT ON TABLE content_changes IS 'Change log for real-time update polling';
