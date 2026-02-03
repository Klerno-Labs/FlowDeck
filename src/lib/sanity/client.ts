import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    '❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
    'Please add it to your environment variables in Vercel: ' +
    'Settings → Environment Variables → Add: ' +
    'NEXT_PUBLIC_SANITY_PROJECT_ID = 0wg9st2m'
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getFileUrl(ref: string): string {
  const [_file, id, extension] = ref.split('-');
  return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${extension}`;
}
