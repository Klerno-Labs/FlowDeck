/**
 * Image Crop & Optimize API
 * POST - Upload, crop, resize, and optimize images
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { put } from '@vercel/blob';

/**
 * POST /api/images/crop
 * Crop, resize, and optimize image
 *
 * Body (multipart/form-data):
 * - image: File - Image file to process
 * - width: number - Target width (optional)
 * - height: number - Target height (optional)
 * - quality: number - JPEG quality 1-100 (default 90)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const width = formData.get('width') ? parseInt(formData.get('width') as string, 10) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string, 10) : undefined;
    const quality = formData.get('quality') ? parseInt(formData.get('quality') as string, 10) : 90;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with sharp
    let sharpInstance = sharp(buffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center',
      });
    }

    // Convert to JPEG with optimization
    const processedBuffer = await sharpInstance
      .jpeg({
        quality,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `content-images/${timestamp}-${randomString}.jpg`;

    // Upload to Vercel Blob
    const blob = await put(filename, processedBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json(
      {
        url: blob.url,
        filename: filename,
        size: processedBuffer.length,
        originalSize: imageFile.size,
        width: width || metadata.width,
        height: height || metadata.height,
        format: 'jpeg',
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/images/crop
 * Get API usage info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/images/crop',
    method: 'POST',
    description: 'Upload, crop, resize, and optimize images',
    parameters: {
      image: 'File (required) - Image file to process',
      width: 'number (optional) - Target width in pixels',
      height: 'number (optional) - Target height in pixels',
      quality: 'number (optional) - JPEG quality 1-100 (default 90)',
    },
    limits: {
      maxFileSize: '10MB',
      supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      outputFormat: 'image/jpeg',
    },
  });
}
