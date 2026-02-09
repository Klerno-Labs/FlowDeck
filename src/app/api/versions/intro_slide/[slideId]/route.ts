/**
 * Version History API for Intro Slides
 * POST - Create new version (publish)
 * GET - Retrieve version history
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVersion, getVersionHistory, getVersion } from '@/lib/db/content-versioning';

/**
 * POST /api/versions/intro_slide/[slideId]
 * Create new version when publishing
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slideId: string } }
) {
  try {
    const { slideId } = params;
    const body = await request.json();
    const { action, versionData, changeSummary } = body;

    if (action !== 'publish') {
      return NextResponse.json(
        { error: 'Invalid action. Use "publish" to create a version.' },
        { status: 400 }
      );
    }

    if (!versionData) {
      return NextResponse.json(
        { error: 'Version data is required' },
        { status: 400 }
      );
    }

    // Create new version
    const version = await createVersion(
      'intro_slide',
      slideId,
      versionData,
      changeSummary || 'Published changes',
      null // userId
    );

    return NextResponse.json(
      {
        success: true,
        version,
        message: 'Version created successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/versions/intro_slide/[slideId]
 * Retrieve version history or specific version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slideId: string } }
) {
  try {
    const { slideId } = params;
    const { searchParams } = new URL(request.url);
    const versionNumber = searchParams.get('version');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Get specific version
    if (versionNumber) {
      const version = await getVersion(
        'intro_slide',
        slideId,
        parseInt(versionNumber, 10)
      );

      if (!version) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { version },
        { status: 200 }
      );
    }

    // Get version history
    const versions = await getVersionHistory('intro_slide', slideId, limit);

    return NextResponse.json(
      {
        versions,
        count: versions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}
