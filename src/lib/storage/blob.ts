/**
 * Vercel Blob Storage Integration
 * Handles file uploads for product images
 */

import { put, del } from '@vercel/blob';

/**
 * Upload an image to Vercel Blob storage
 * @param file - The file to upload
 * @param path - The path/name for the file
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const blob = await put(path, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return blob.url;
  } catch (error) {
    console.error('Error uploading image to blob storage:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete an image from Vercel Blob storage
 * @param url - The URL of the file to delete
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting image from blob storage:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Upload multiple images at once
 * @param files - Array of files to upload
 * @param basePath - Base path for all files
 * @returns Array of public URLs
 */
export async function uploadImages(files: File[], basePath: string = 'products'): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file, `${basePath}/${Date.now()}_${index}_${file.name}`)
  );

  return Promise.all(uploadPromises);
}
