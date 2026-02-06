import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/products';

/**
 * GET /api/specifications
 * Get specifications by product ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      );
    }

    const specifications = await db.getSpecificationsByProduct(productId);
    return NextResponse.json({ specifications });
  } catch (error) {
    console.error('Error fetching specifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/specifications
 * Create a new specification
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
    if (!data.product_id || !data.spec_key || !data.spec_value || data.display_order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, spec_key, spec_value, display_order' },
        { status: 400 }
      );
    }

    const specification = await db.createSpecification(
      {
        product_id: data.product_id,
        spec_key: data.spec_key,
        spec_value: data.spec_value,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ specification }, { status: 201 });
  } catch (error) {
    console.error('Error creating specification:', error);
    return NextResponse.json(
      { error: 'Failed to create specification' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/specifications/[id]
 * Update a specification
 * Requires authentication
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'Specification ID is required' },
        { status: 400 }
      );
    }

    const specification = await db.updateSpecification(
      data.id,
      {
        spec_key: data.spec_key,
        spec_value: data.spec_value,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ specification });
  } catch (error) {
    console.error('Error updating specification:', error);
    return NextResponse.json(
      { error: 'Failed to update specification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/specifications
 * Delete a specification or all specifications for a product
 * Requires authentication
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const productId = searchParams.get('productId');

    if (productId) {
      await db.deleteAllSpecificationsByProduct(productId, session.user.id);
    } else if (id) {
      await db.deleteSpecification(id, session.user.id);
    } else {
      return NextResponse.json(
        { error: 'Either id or productId is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting specification:', error);
    return NextResponse.json(
      { error: 'Failed to delete specification' },
      { status: 500 }
    );
  }
}
