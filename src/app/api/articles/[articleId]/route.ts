import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { articleBySlugQuery } from '@/lib/sanity/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { articleId: string } }
) {
  try {
    const article = await sanityClient.fetch(articleBySlugQuery, {
      slug: params.articleId,
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
