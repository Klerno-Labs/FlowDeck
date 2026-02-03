import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pdfContent',
  title: 'PDF Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'E.g., Content 1, Technical Spec Sheet',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Spec Sheet', value: 'spec' },
          { title: 'Sales Sheet', value: 'sales' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Brochure', value: 'brochure' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
      };
    },
  },
});
