import { NextResponse } from 'next/server';
import * as db from '@/lib/db/products';

/**
 * GET /api/products/last-updated
 * Get the timestamp of the last content change
 * Used for real-time polling to detect updates
 */
export async function GET() {
  try {
    const lastUpdated = await db.getLastChangeTimestamp();

    return NextResponse.json({
      lastUpdated: lastUpdated?.toISOString() || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching last updated timestamp:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last updated timestamp' },
      { status: 500 }
    );
  }
}
