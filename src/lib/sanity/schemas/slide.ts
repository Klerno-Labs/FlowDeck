import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'slide',
  title: 'Presentation Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'E.g., Company Overview, What We Guarantee',
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
      name: 'order',
      title: 'Slide Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Split (50/50)', value: 'split' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional background image for the slide',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code if no background image',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional video embed URL',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'backgroundImage',
    },
    prepare({ title, order, media }) {
      return {
        title: `${order}. ${title}`,
        media,
      };
    },
  },
});
