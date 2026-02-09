/**
 * Draft Management API
 * GET - Get draft
 * POST - Save/update draft
 * DELETE - Delete draft
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDraft, saveDraft, deleteDraft } from '@/lib/db/content-versioning';

interface RouteParams {
  params: {
    contentType: string;
    contentId: string;
  };
}

/**
 * GET /api/drafts/[contentType]/[contentId]
 * Get draft for specific content
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contentType, contentId } = params;

    const draft = await getDraft(contentType, contentId);

    if (!draft) {
      return NextResponse.json(
        { draft: null, hasDraft: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { draft, hasDraft: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting draft:', error);
    return NextResponse.json(
      { error: 'Failed to get draft' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/drafts/[contentType]/[contentId]
 * Save or update draft
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contentType, contentId } = params;
    const body = await request.json();
    const { draftData, userId } = body;

    if (!draftData) {
      return NextResponse.json(
        { error: 'draftData is required' },
        { status: 400 }
      );
    }

    const draft = await saveDraft(
      contentType,
      contentId,
      draftData,
      userId || null
    );

    return NextResponse.json(
      { draft, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drafts/[contentType]/[contentId]
 * Delete draft (discard changes)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { contentType, contentId } = params;

    await deleteDraft(contentType, contentId);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
