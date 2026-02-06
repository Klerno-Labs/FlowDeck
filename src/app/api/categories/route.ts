import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/products';

/**
 * GET /api/categories
 * Get all categories
 */
export async function GET() {
  try {
    const categories = await db.getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.code || !data.title || !data.slug || !data.background_color || data.display_order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: code, title, slug, background_color, display_order' },
        { status: 400 }
      );
    }

    const category = await db.createCategory(
      {
        code: data.code,
        title: data.title,
        slug: data.slug,
        background_color: data.background_color,
        subtitle: data.subtitle,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
