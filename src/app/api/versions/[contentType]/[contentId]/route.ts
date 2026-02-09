/**
 * Version History API
 * GET - Get version history
 * POST - Create new version (publish)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getVersionHistory,
  getVersion,
  publishDraft,
  restoreVersion,
  getVersionCount,
} from '@/lib/db/content-versioning';

interface RouteParams {
  params: {
    contentType: string;
    contentId: string;
  };
}

/**
 * GET /api/versions/[contentType]/[contentId]
 * Get version history for content
 * Query params:
 * - limit: number of versions to return (default 50)
 * - versionNumber: get specific version
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contentType, contentId } = params;
    const searchParams = request.nextUrl.searchParams;
    const versionNumber = searchParams.get('versionNumber');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Get specific version
    if (versionNumber) {
      const version = await getVersion(
        contentType,
        contentId,
        parseInt(versionNumber, 10)
      );

      if (!version) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ version }, { status: 200 });
    }

    // Get version history
    const versions = await getVersionHistory(contentType, contentId, limit);
    const count = await getVersionCount(contentType, contentId);

    return NextResponse.json(
      {
        versions,
        total: count,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting versions:', error);
    return NextResponse.json(
      { error: 'Failed to get versions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/versions/[contentType]/[contentId]
 * Publish draft (create version) or restore version
 * Body:
 * - action: 'publish' | 'restore'
 * - changeSummary: optional description (for publish)
 * - versionNumber: required for restore
 * - userId: optional user ID
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contentType, contentId } = params;
    const body = await request.json();
    const { action, changeSummary, versionNumber, userId } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action is required (publish or restore)' },
        { status: 400 }
      );
    }

    // Publish draft
    if (action === 'publish') {
      const version = await publishDraft(
        contentType,
        contentId,
        changeSummary || null,
        userId || null
      );

      return NextResponse.json(
        {
          version,
          success: true,
          message: 'Draft published successfully',
        },
        { status: 200 }
      );
    }

    // Restore version
    if (action === 'restore') {
      if (!versionNumber) {
        return NextResponse.json(
          { error: 'versionNumber is required for restore' },
          { status: 400 }
        );
      }

      const draft = await restoreVersion(
        contentType,
        contentId,
        parseInt(versionNumber, 10),
        userId || null
      );

      return NextResponse.json(
        {
          draft,
          success: true,
          message: `Version ${versionNumber} restored to draft`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "publish" or "restore"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error processing version action:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process version action' },
      { status: 500 }
    );
  }
}
