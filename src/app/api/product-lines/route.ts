import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/products';

/**
 * GET /api/product-lines
 * Get all product lines or by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('categorySlug');

    let productLines;

    if (categoryId) {
      productLines = await db.getProductLinesByCategory(categoryId);
    } else if (categorySlug) {
      productLines = await db.getProductLineByCategorySlug(categorySlug);
    } else {
      productLines = await db.getAllProductLines();
    }

    return NextResponse.json({ productLines });
  } catch (error) {
    console.error('Error fetching product lines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product lines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product-lines
 * Create a new product line
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
    if (!data.category_id || !data.title || !data.slug || data.display_order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: category_id, title, slug, display_order' },
        { status: 400 }
      );
    }

    const productLine = await db.createProductLine(
      {
        category_id: data.category_id,
        title: data.title,
        slug: data.slug,
        logo_path: data.logo_path,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ productLine }, { status: 201 });
  } catch (error) {
    console.error('Error creating product line:', error);
    return NextResponse.json(
      { error: 'Failed to create product line' },
      { status: 500 }
    );
  }
}
