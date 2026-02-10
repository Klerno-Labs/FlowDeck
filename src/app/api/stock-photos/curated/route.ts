import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

/**
 * Get curated/editorial Unsplash photos
 * GET /api/stock-photos/curated?page=1&per_page=30
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '30';

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&per_page=${perPage}&order_by=popular`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const photos = await response.json();

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching curated photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curated photos' },
      { status: 500 }
    );
  }
}
