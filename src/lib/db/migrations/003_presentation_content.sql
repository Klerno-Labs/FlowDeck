-- ============================================================================
-- PRESENTATION CONTENT SCHEMA
-- Migration 003: Create tables for editable presentation content
-- ============================================================================

-- ============================================================================
-- INTRO SECTION TABLES
-- ============================================================================

-- Intro Slides (Company Overview, What We Guarantee)
CREATE TABLE IF NOT EXISTS presentation_slides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slide_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  heading TEXT NOT NULL,
  paragraph TEXT NOT NULL,
  image_path TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id)
);

-- Slide Bullet Points/List Items
CREATE TABLE IF NOT EXISTS slide_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slide_id TEXT NOT NULL REFERENCES presentation_slides(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  bullet_color TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- KNOWLEDGE BASE TABLES
-- ============================================================================

-- Knowledge Base Carousel Slides
CREATE TABLE IF NOT EXISTS knowledge_slides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slide_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  layout TEXT NOT NULL CHECK (layout IN ('content-left', 'content-right')),
  image_path TEXT NOT NULL,
  quote TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES users(id)
);

-- Knowledge Slide Content Items
CREATE TABLE IF NOT EXISTS knowledge_slide_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slide_id TEXT NOT NULL REFERENCES knowledge_slides(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_slide_items_slide ON slide_items(slide_id, display_order);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_slide ON knowledge_slide_items(slide_id, display_order);
CREATE INDEX IF NOT EXISTS idx_presentation_slides_active ON presentation_slides(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_knowledge_slides_active ON knowledge_slides(is_active, display_order);

-- ============================================================================
-- SEED DATA: COMPANY OVERVIEW SLIDE
-- ============================================================================

INSERT INTO presentation_slides (slide_key, title, heading, paragraph, image_path, display_order)
VALUES
  ('company-overview', 'Company Overview', 'Company Overview',
   'Founded by John Paraskeva in 1987, Filtration Technology Corporation (FTC) started as a technical service company. Since then, FTC has evolved into a vertically integrated manufacturer producing one industry''s widest selections of high-end industrial filtration products. Today FTC specializes in innovative filter designs with developmental capabilities to provide custom solutions in fluid removal, filtration and reclamation.',
   '/images/john-paraskeva.jpg', 1)
ON CONFLICT (slide_key) DO NOTHING;

-- Company Overview Bullet Points
INSERT INTO slide_items (slide_id, content, bullet_color, display_order)
SELECT id, 'Process clarification', '#00B4D8', 1 FROM presentation_slides WHERE slide_key = 'company-overview'
UNION ALL
SELECT id, 'Process monitoring', '#1E5AA8', 2 FROM presentation_slides WHERE slide_key = 'company-overview'
UNION ALL
SELECT id, 'Efficient filtration', '#8DC63F', 3 FROM presentation_slides WHERE slide_key = 'company-overview'
UNION ALL
SELECT id, 'Better process control', '#F17A2C', 4 FROM presentation_slides WHERE slide_key = 'company-overview'
UNION ALL
SELECT id, 'Water treatment', '#4169E1', 5 FROM presentation_slides WHERE slide_key = 'company-overview'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: WHAT WE GUARANTEE SLIDE
-- ============================================================================

INSERT INTO presentation_slides (slide_key, title, heading, paragraph, image_path, display_order)
VALUES
  ('what-we-guarantee', 'What We Guarantee', 'What We Guarantee',
   'We guarantee that our customers will receive products manufactured to the highest standard that function to the specifications listed in that order. SQF Version 9 - We use Codex HACCP to identify prominent food threats such as:',
   '/images/facility-interior.jpg', 2)
ON CONFLICT (slide_key) DO NOTHING;

-- What We Guarantee Bullet Points
INSERT INTO slide_items (slide_id, content, bullet_color, display_order)
SELECT id, 'Product Integrity', '#00B4D8', 1 FROM presentation_slides WHERE slide_key = 'what-we-guarantee'
UNION ALL
SELECT id, 'Microbial', '#1E5AA8', 2 FROM presentation_slides WHERE slide_key = 'what-we-guarantee'
UNION ALL
SELECT id, 'Physical', '#8DC63F', 3 FROM presentation_slides WHERE slide_key = 'what-we-guarantee'
UNION ALL
SELECT id, 'Chemical', '#F17A2C', 4 FROM presentation_slides WHERE slide_key = 'what-we-guarantee'
UNION ALL
SELECT id, 'Allergen', '#4169E1', 5 FROM presentation_slides WHERE slide_key = 'what-we-guarantee'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: KNOWLEDGE BASE SLIDES
-- ============================================================================

INSERT INTO knowledge_slides (slide_key, title, subtitle, layout, image_path, quote, display_order)
VALUES
  ('total-cost-of-filtration', 'Total Cost of Filtration:', 'What does it mean?', 'content-left',
   '/images/knowledge-base/bad-tattoo.jpg',
   'There''s always someone who will do it cheaper.', 1),
  ('why-do-we-filter', 'Why do we filter?', NULL, 'content-right',
   '/images/knowledge-base/filter-vessel.png', NULL, 2)
ON CONFLICT (slide_key) DO NOTHING;

-- Total Cost of Filtration Items
INSERT INTO knowledge_slide_items (slide_id, content, display_order)
SELECT id, 'Initial equipment prices for cartridges', 1 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Differential pressure', 2 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Downtime', 3 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Changeout frequency', 4 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Disposal of spent cartridges', 5 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Regeneration of spent cartridges', 6 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Product quality', 7 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Filter quality', 8 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Validation', 9 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
UNION ALL
SELECT id, 'Labor', 10 FROM knowledge_slides WHERE slide_key = 'total-cost-of-filtration'
ON CONFLICT DO NOTHING;

-- Why Do We Filter Items
INSERT INTO knowledge_slide_items (slide_id, content, display_order)
SELECT id, 'Removal of Unwanted Contaminants', 1 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'Extended Life of Equipment', 2 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'Clarity and Shine', 3 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'Protection of Pumps and Spray Nozzles', 4 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'No taste, odor of off flavors', 5 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'Separation of Oil from Condensate', 6 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
UNION ALL
SELECT id, 'Improved Air Quality', 7 FROM knowledge_slides WHERE slide_key = 'why-do-we-filter'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
