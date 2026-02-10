import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BRAND_KIT_FILE = path.join(process.cwd(), 'data', 'brand-kit.json');

/**
 * Brand Kit API
 * GET - Load brand kit
 * POST - Save brand kit
 */

export async function GET(request: NextRequest) {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Try to read existing brand kit
    try {
      const data = await fs.readFile(BRAND_KIT_FILE, 'utf-8');
      const brandKit = JSON.parse(data);
      return NextResponse.json({ brandKit });
    } catch {
      // Return default brand kit if file doesn't exist
      const defaultBrandKit = {
        id: 'default',
        name: 'FlowDeck Brand',
        colors: [
          { id: '1', name: 'Primary Blue', hex: '#1E5AA8', usage: 'primary' },
          { id: '2', name: 'Cyan', hex: '#00B4D8', usage: 'secondary' },
          { id: '3', name: 'Green', hex: '#8DC63F', usage: 'accent' },
          { id: '4', name: 'Orange', hex: '#F17A2C', usage: 'accent' },
        ],
        fonts: [
          {
            id: '1',
            name: 'Inter',
            fontFamily: 'Inter, sans-serif',
            usage: 'heading',
          },
          {
            id: '2',
            name: 'System UI',
            fontFamily: 'system-ui, sans-serif',
            usage: 'body',
          },
        ],
        logos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({ brandKit: defaultBrandKit });
    }
  } catch (error) {
    console.error('Error loading brand kit:', error);
    return NextResponse.json(
      { error: 'Failed to load brand kit' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { brandKit } = await request.json();

    if (!brandKit) {
      return NextResponse.json(
        { error: 'Brand kit data is required' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Save brand kit
    await fs.writeFile(
      BRAND_KIT_FILE,
      JSON.stringify(brandKit, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true, brandKit });
  } catch (error) {
    console.error('Error saving brand kit:', error);
    return NextResponse.json(
      { error: 'Failed to save brand kit' },
      { status: 500 }
    );
  }
}
