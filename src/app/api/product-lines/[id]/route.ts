import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/products';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productLine = await db.getProductLineById(params.id);

    if (!productLine) {
      return NextResponse.json({ error: 'Product line not found' }, { status: 404 });
    }

    return NextResponse.json({ productLine });
  } catch (error) {
    console.error('Error fetching product line:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product line' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const productLine = await db.updateProductLine(
      params.id,
      {
        category_id: data.category_id,
        title: data.title,
        slug: data.slug,
        logo_path: data.logo_path,
        display_order: data.display_order,
      },
      session.user.id
    );

    return NextResponse.json({ productLine });
  } catch (error) {
    console.error('Error updating product line:', error);
    return NextResponse.json(
      { error: 'Failed to update product line' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.deleteProductLine(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product line:', error);
    return NextResponse.json(
      { error: 'Failed to delete product line' },
      { status: 500 }
    );
  }
}
