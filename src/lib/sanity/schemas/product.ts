import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productLine',
      title: 'Product Line',
      type: 'reference',
      to: [{ type: 'productLine' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageColor',
      title: 'Product Image (Color)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageBW',
      title: 'Product Image (Black & White)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    // Specifications matching PDF structure
    defineField({
      name: 'commonMarkets',
      title: 'Common Markets',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g., General Industrial, Oil & Gas, Chemical Production',
    }),
    defineField({
      name: 'applications',
      title: 'Common Applications',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'flowDirection',
      title: 'Flow Direction',
      type: 'string',
      description: 'E.g., Outside-to-Inside',
    }),
    defineField({
      name: 'micronRatings',
      title: 'Micron Ratings',
      type: 'string',
      description: 'E.g., 0.5 - 150 micron',
    }),
    defineField({
      name: 'standardEfficiency',
      title: 'Standard Efficiency Rating',
      type: 'string',
      description: 'E.g., 99.98%',
    }),
    defineField({
      name: 'mediaOptions',
      title: 'Standard Media Material Options',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g., Polypropylene, Phenolic Cellulose',
    }),
    defineField({
      name: 'hardwareOptions',
      title: 'Hardware Options',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g., Polypropylene, Tinned Steel, 304 SS, 316 SS',
    }),
    defineField({
      name: 'diameter',
      title: 'Diameter (inches)',
      type: 'string',
      description: 'E.g., 6.25"',
    }),
    defineField({
      name: 'standardLengths',
      title: 'Standard Lengths',
      type: 'string',
      description: 'E.g., 30" & 40"',
    }),
    defineField({
      name: 'flowRateMin',
      title: 'Flow Rate Min (gpm)',
      type: 'number',
    }),
    defineField({
      name: 'flowRateMax',
      title: 'Flow Rate Max (m³/hr)',
      type: 'number',
    }),
    defineField({
      name: 'dirtLoadingMin',
      title: 'Dirt Loading Min (lbs)',
      type: 'number',
    }),
    defineField({
      name: 'dirtLoadingMax',
      title: 'Dirt Loading Max (grams)',
      type: 'number',
    }),
    defineField({
      name: 'surfaceArea',
      title: 'Surface Area (ft²)',
      type: 'string',
      description: 'E.g., Varies based on Media & Micron Rating',
    }),
    defineField({
      name: 'maxDifferentialPressure',
      title: 'Max Recommended Differential Pressure',
      type: 'string',
      description: 'E.g., 35 PSID (2.4 bar), 50 PSID (3.45 bar)',
    }),
    defineField({
      name: 'vesselTechnology',
      title: 'Vessel Technology',
      type: 'string',
      description: 'E.g., Clarify™',
    }),
    // PDF Content
    defineField({
      name: 'pdfContent',
      title: 'PDF Content',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pdfContent' }] }],
      description: 'Associated PDF files (spec sheets, brochures, etc.)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'productLine.title',
    },
  },
});
