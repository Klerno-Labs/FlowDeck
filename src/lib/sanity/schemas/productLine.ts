import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productLine',
  title: 'Product Line',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Line Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'E.g., CLARIFY, SIEVA, TORRENT, INVICTA',
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      description: 'Parent category (LS, LL, GL, GS)',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'logoColor',
      title: 'Logo (Color)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'logoWhite',
      title: 'Logo (White)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for grid card background',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
      subtitle: 'category.title',
    },
  },
});
