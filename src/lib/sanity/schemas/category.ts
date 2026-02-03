import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'E.g., LIQUID | SOLID',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'code',
        maxLength: 10,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Two-letter code: LS, LL, GL, or GS',
      options: {
        list: [
          { title: 'LS - LIQUID | SOLID', value: 'ls' },
          { title: 'LL - LIQUID | LIQUID', value: 'll' },
          { title: 'GL - GAS | LIQUID', value: 'gl' },
          { title: 'GS - GAS | SOLID', value: 'gs' },
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Molecular diagram icon from PDF',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
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
      description: 'Hex color for grid card',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'code',
      media: 'icon',
    },
  },
});
