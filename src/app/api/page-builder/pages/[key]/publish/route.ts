/**
 * Page Builder API - Publish Page
 * POST: Publish page configuration to live site
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/protect-route';
import { query } from '@/lib/db/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const result = await query(
      `UPDATE page_configs
       SET is_published = true,
           published_at = CURRENT_TIMESTAMP,
           published_by = $2
       WHERE page_key = $1
       RETURNING *`,
      [params.key, session?.user?.id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      page: result[0],
      message: 'Page published successfully',
    });
  } catch (err) {
    console.error('Failed to publish page:', err);
    return NextResponse.json(
      { error: 'Failed to publish page' },
      { status: 500 }
    );
  }
}
