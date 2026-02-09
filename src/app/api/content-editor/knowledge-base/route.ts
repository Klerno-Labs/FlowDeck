import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import * as db from '@/lib/db/presentation-content';

/**
 * GET /api/content-editor/knowledge-base
 * Fetch all knowledge base slides with items
 */
export async function GET() {
  try {
    const slides = await db.getAllKnowledgeSlides();
    return NextResponse.json({ slides }, { status: 200 });
  } catch (error) {
    console.error('Error fetching knowledge base slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content-editor/knowledge-base
 * Update knowledge base slide content and items
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slideId, data, items } = body;

    if (!slideId) {
      return NextResponse.json(
        { error: 'Missing slideId' },
        { status: 400 }
      );
    }

    // Update slide main content (title, subtitle, layout, image, quote)
    if (data) {
      await db.updateKnowledgeSlide(slideId, data, session.user.id);
    }

    // Update items (content items)
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (item.id.startsWith('temp-')) {
          // New item - add it
          await db.addKnowledgeSlideItem(
            slideId,
            item.content,
            item.display_order
          );
        } else {
          // Existing item - update it
          await db.updateKnowledgeSlideItem(
            item.id,
            item.content
          );
        }
      }

      // Reorder all items
      const itemsToReorder = items
        .filter((item: any) => !item.id.startsWith('temp-'))
        .map((item: any, index: number) => ({
          id: item.id,
          display_order: index + 1,
        }));

      if (itemsToReorder.length > 0) {
        await db.reorderKnowledgeSlideItems(itemsToReorder);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Slide updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating knowledge base slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}
