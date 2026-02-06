import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/products';

/**
 * GET /api/products
 * Get all products or products by query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');
    const lineSlug = searchParams.get('lineSlug');

    let products;

    if (lineId) {
      products = await db.getProductsByLine(lineId);
    } else if (lineSlug) {
      products = await db.getProductsByLineSlug(lineSlug);
    } else {
      products = await db.getAllProducts();
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
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
    if (!data.product_line_id || !data.name || !data.slug || data.display_order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: product_line_id, name, slug, display_order' },
        { status: 400 }
      );
    }

    const product = await db.createProduct(
      {
        product_line_id: data.product_line_id,
        name: data.name,
        slug: data.slug,
        image_path: data.image_path,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
