/**
 * Page Builder API - Individual Page Operations
 * GET: Get page configuration
 * PATCH: Update page configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/protect-route';
import { query } from '@/lib/db/client';
import { z } from 'zod';

const updateConfigSchema = z.object({
  config: z.object({
    elements: z.array(z.any()),
    styles: z.record(z.any()),
    meta: z.record(z.any()).optional(),
  }),
});

/**
 * GET /api/page-builder/pages/[key]
 * Get a specific page configuration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
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
      WHERE page_key = $1`,
      [params.key]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page: result[0] });
  } catch (err) {
    console.error('Failed to fetch page:', err);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/page-builder/pages/[key]
 * Update page configuration (draft save)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const validatedData = updateConfigSchema.parse(body);

    // Save to history before updating
    await query(
      `INSERT INTO page_config_history (page_config_id, config, version, created_by)
       SELECT
         id,
         config,
         COALESCE((
           SELECT MAX(version) + 1
           FROM page_config_history
           WHERE page_config_id = page_configs.id
         ), 1),
         $2
       FROM page_configs
       WHERE page_key = $1`,
      [params.key, session?.user?.id]
    );

    // Update the page config
    const result = await query(
      `UPDATE page_configs
       SET config = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
       WHERE page_key = $1
       RETURNING *`,
      [params.key, JSON.stringify(validatedData.config), session?.user?.id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      page: result[0],
      message: 'Page updated successfully',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update page:', err);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}
