/**
 * Draft Management API for Knowledge Base Slides
 * POST - Save draft for a specific slide
 * GET - Retrieve draft for a specific slide
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveDraft, getDraft } from '@/lib/db/content-versioning';

/**
 * POST /api/drafts/knowledge_slide/[slideId]
 * Save draft content for a slide
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slideId: string } }
) {
  try {
    const { slideId } = params;
    const body = await request.json();
    const { draftData } = body;

    if (!draftData) {
      return NextResponse.json(
        { error: 'Draft data is required' },
        { status: 400 }
      );
    }

    // Save draft (upserts automatically)
    const draft = await saveDraft('knowledge_slide', slideId, draftData, null);

    return NextResponse.json(
      {
        success: true,
        draft,
        message: 'Draft saved successfully',
      },
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
 * GET /api/drafts/knowledge_slide/[slideId]
 * Retrieve draft content for a slide
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slideId: string } }
) {
  try {
    const { slideId } = params;

    const draft = await getDraft('knowledge_slide', slideId);

    if (!draft) {
      return NextResponse.json(
        { draft: null, hasDraft: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        draft,
        hasDraft: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}
