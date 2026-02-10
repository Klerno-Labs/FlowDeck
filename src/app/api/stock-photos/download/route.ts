import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

/**
 * Track Unsplash photo download (required by Unsplash API guidelines)
 * POST /api/stock-photos/download
 */
export async function POST(request: NextRequest) {
  try {
    const { downloadLocation } = await request.json();

    if (!downloadLocation) {
      return NextResponse.json(
        { error: 'Download location is required' },
        { status: 400 }
      );
    }

    // Trigger download tracking
    const response = await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to track download');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
