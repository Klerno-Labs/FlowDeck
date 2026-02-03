import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '../src/lib/sanity/schemas';

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    '❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
    'Please add it to your .env.local file or Vercel environment variables.'
  );
}

export default defineConfig({
  name: 'ftc-flowdeck',
  title: 'FTC FlowDeck CMS',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
});
