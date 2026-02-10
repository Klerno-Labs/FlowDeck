import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

/**
 * Search Unsplash photos
 * GET /api/stock-photos/search?query=nature&page=1&per_page=30
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'nature';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '30';

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&order_by=relevant`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();

    return NextResponse.json({
      photos: data.results,
      total: data.total,
      total_pages: data.total_pages,
    });
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    return NextResponse.json(
      { error: 'Failed to search photos' },
      { status: 500 }
    );
  }
}
