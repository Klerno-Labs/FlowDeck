-- ============================================================================
-- CONTENT VERSIONING MIGRATION
-- Adds draft/publish workflow and version history for content editing
-- ============================================================================

-- ============================================================================
-- DRAFTS TABLE
-- Stores unpublished changes for all content types
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_drafts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content_type VARCHAR(50) NOT NULL, -- 'intro_slide', 'knowledge_slide'
  content_id TEXT NOT NULL, -- ID of the content being edited
  draft_data JSONB NOT NULL, -- Complete draft state (all fields)
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure only one draft per content item
  UNIQUE(content_type, content_id)
);

-- ============================================================================
-- VERSIONS TABLE
-- Stores complete history of published changes
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  content_type VARCHAR(50) NOT NULL, -- 'intro_slide', 'knowledge_slide'
  content_id TEXT NOT NULL, -- ID of the content
  version_number INTEGER NOT NULL, -- Auto-incrementing version number
  version_data JSONB NOT NULL, -- Complete snapshot at publish time
  change_summary TEXT, -- Optional description of changes
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure unique version numbers per content item
  UNIQUE(content_type, content_id, version_number)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Fast lookups for drafts by content
CREATE INDEX idx_content_drafts_lookup
  ON content_drafts(content_type, content_id);

-- Fast lookups for versions by content
CREATE INDEX idx_content_versions_lookup
  ON content_versions(content_type, content_id);

-- Fast sorting of versions by number
CREATE INDEX idx_content_versions_sort
  ON content_versions(content_type, content_id, version_number DESC);

-- Fast lookups by creator
CREATE INDEX idx_content_drafts_creator
  ON content_drafts(created_by);

CREATE INDEX idx_content_versions_creator
  ON content_versions(created_by);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp on drafts
CREATE OR REPLACE FUNCTION update_draft_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_draft_timestamp
  BEFORE UPDATE ON content_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_draft_timestamp();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get next version number
CREATE OR REPLACE FUNCTION get_next_version_number(
  p_content_type VARCHAR(50),
  p_content_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
  max_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) INTO max_version
  FROM content_versions
  WHERE content_type = p_content_type
    AND content_id = p_content_id;

  RETURN max_version + 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROLLBACK SCRIPT (for emergencies)
-- ============================================================================

-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_update_draft_timestamp ON content_drafts;
-- DROP FUNCTION IF EXISTS update_draft_timestamp();
-- DROP FUNCTION IF EXISTS get_next_version_number(VARCHAR, TEXT);
-- DROP INDEX IF EXISTS idx_content_versions_creator;
-- DROP INDEX IF EXISTS idx_content_drafts_creator;
-- DROP INDEX IF EXISTS idx_content_versions_sort;
-- DROP INDEX IF EXISTS idx_content_versions_lookup;
-- DROP INDEX IF EXISTS idx_content_drafts_lookup;
-- DROP TABLE IF EXISTS content_versions;
-- DROP TABLE IF EXISTS content_drafts;
