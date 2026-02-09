/**
 * Content Versioning & Draft Management
 * Database access layer for draft/publish workflow and version history
 */

import { query, queryOne } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface ContentDraft {
  id: string;
  content_type: string;
  content_id: string;
  draft_data: any; // JSONB - structure depends on content_type
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ContentVersion {
  id: string;
  content_type: string;
  content_id: string;
  version_number: number;
  version_data: any; // JSONB - complete snapshot
  change_summary: string | null;
  created_by: string | null;
  created_at: Date;
}

// ============================================================================
// DRAFT OPERATIONS
// ============================================================================

/**
 * Get draft for a specific content item
 */
export async function getDraft(
  contentType: string,
  contentId: string
): Promise<ContentDraft | null> {
  try {
    return await queryOne<ContentDraft>(
      'SELECT * FROM content_drafts WHERE content_type = $1 AND content_id = $2',
      [contentType, contentId]
    );
  } catch (error) {
    console.error('Error getting draft:', error);
    throw error;
  }
}

/**
 * Save or update draft
 */
export async function saveDraft(
  contentType: string,
  contentId: string,
  draftData: any,
  userId: string | null = null
): Promise<ContentDraft> {
  try {
    const result = await query<ContentDraft>(
      `INSERT INTO content_drafts (content_type, content_id, draft_data, created_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (content_type, content_id)
       DO UPDATE SET draft_data = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [contentType, contentId, JSON.stringify(draftData), userId]
    );

    return result[0];
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
}

/**
 * Delete draft (when publishing or discarding)
 */
export async function deleteDraft(
  contentType: string,
  contentId: string
): Promise<void> {
  try {
    await query(
      'DELETE FROM content_drafts WHERE content_type = $1 AND content_id = $2',
      [contentType, contentId]
    );
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
}

/**
 * Check if draft exists
 */
export async function hasDraft(
  contentType: string,
  contentId: string
): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM content_drafts
        WHERE content_type = $1 AND content_id = $2
      ) as exists`,
      [contentType, contentId]
    );

    return result?.exists || false;
  } catch (error) {
    console.error('Error checking draft:', error);
    throw error;
  }
}

// ============================================================================
// VERSION OPERATIONS
// ============================================================================

/**
 * Create new version (on publish)
 */
export async function createVersion(
  contentType: string,
  contentId: string,
  versionData: any,
  changeSummary: string | null = null,
  userId: string | null = null
): Promise<ContentVersion> {
  try {
    // Get next version number
    const versionNumberResult = await queryOne<{ next_version: number }>(
      'SELECT get_next_version_number($1, $2) as next_version',
      [contentType, contentId]
    );
    const versionNumber = versionNumberResult?.next_version || 1;

    // Create version
    const result = await query<ContentVersion>(
      `INSERT INTO content_versions (
        content_type, content_id, version_number, version_data, change_summary, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [contentType, contentId, versionNumber, JSON.stringify(versionData), changeSummary, userId]
    );

    return result[0];
  } catch (error) {
    console.error('Error creating version:', error);
    throw error;
  }
}

/**
 * Get all versions for content (newest first)
 */
export async function getVersionHistory(
  contentType: string,
  contentId: string,
  limit: number = 50
): Promise<ContentVersion[]> {
  try {
    return await query<ContentVersion>(
      `SELECT * FROM content_versions
       WHERE content_type = $1 AND content_id = $2
       ORDER BY version_number DESC
       LIMIT $3`,
      [contentType, contentId, limit]
    );
  } catch (error) {
    console.error('Error getting version history:', error);
    throw error;
  }
}

/**
 * Get specific version
 */
export async function getVersion(
  contentType: string,
  contentId: string,
  versionNumber: number
): Promise<ContentVersion | null> {
  try {
    return await queryOne<ContentVersion>(
      'SELECT * FROM content_versions WHERE content_type = $1 AND content_id = $2 AND version_number = $3',
      [contentType, contentId, versionNumber]
    );
  } catch (error) {
    console.error('Error getting version:', error);
    throw error;
  }
}

/**
 * Get latest version
 */
export async function getLatestVersion(
  contentType: string,
  contentId: string
): Promise<ContentVersion | null> {
  try {
    return await queryOne<ContentVersion>(
      `SELECT * FROM content_versions
       WHERE content_type = $1 AND content_id = $2
       ORDER BY version_number DESC
       LIMIT 1`,
      [contentType, contentId]
    );
  } catch (error) {
    console.error('Error getting latest version:', error);
    throw error;
  }
}

/**
 * Get version count
 */
export async function getVersionCount(
  contentType: string,
  contentId: string
): Promise<number> {
  try {
    const result = await queryOne<{ count: string }>(
      'SELECT COUNT(*)::text as count FROM content_versions WHERE content_type = $1 AND content_id = $2',
      [contentType, contentId]
    );

    return parseInt(result?.count || '0', 10);
  } catch (error) {
    console.error('Error getting version count:', error);
    throw error;
  }
}

// ============================================================================
// COMBINED OPERATIONS
// ============================================================================

/**
 * Publish draft (create version + delete draft + update published content)
 * Returns the created version
 */
export async function publishDraft(
  contentType: string,
  contentId: string,
  changeSummary: string | null = null,
  userId: string | null = null
): Promise<ContentVersion> {
  try {
    // Get draft
    const draft = await getDraft(contentType, contentId);
    if (!draft) {
      throw new Error('No draft found to publish');
    }

    // Create version with draft data
    const version = await createVersion(
      contentType,
      contentId,
      draft.draft_data,
      changeSummary,
      userId
    );

    // Delete draft (published)
    await deleteDraft(contentType, contentId);

    return version;
  } catch (error) {
    console.error('Error publishing draft:', error);
    throw error;
  }
}

/**
 * Restore version to draft
 */
export async function restoreVersion(
  contentType: string,
  contentId: string,
  versionNumber: number,
  userId: string | null = null
): Promise<ContentDraft> {
  try {
    // Get version
    const version = await getVersion(contentType, contentId, versionNumber);
    if (!version) {
      throw new Error('Version not found');
    }

    // Save as draft
    const draft = await saveDraft(
      contentType,
      contentId,
      version.version_data,
      userId
    );

    return draft;
  } catch (error) {
    console.error('Error restoring version:', error);
    throw error;
  }
}
