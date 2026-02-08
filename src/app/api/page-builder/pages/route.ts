/**
 * Page Builder API - List all pages
 * GET: List all editable pages with their configurations
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/protect-route';
import { query } from '@/lib/db/client';

export async function GET() {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const result = await query(
      `SELECT
        id,
        page_key,
        page_title,
        config,
        is_published,
        created_at,
        updated_at,
        updated_by,
        published_at,
        published_by
      FROM page_configs
      ORDER BY page_title ASC`
    );

    return NextResponse.json({ pages: result });
  } catch (err) {
    console.error('Failed to fetch pages:', err);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
