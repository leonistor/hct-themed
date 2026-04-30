import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  enableQueryPresets: true,
  fields: [
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'kind',
      type: 'radio',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Illustration', value: 'illustration' },
        { label: 'Blog', value: 'blog' },
        { label: 'Partners', value: 'partners' },
        { label: 'Customers', value: 'customers' },
        { label: 'Projects', value: 'projects' },
      ],
      defaultValue: 'draft',
      admin: { layout: 'horizontal' },
    },
  ],
  upload: {
    staticDir: '../web/src/assets/payload',
    displayPreview: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'square',
        width: 300,
        height: 300,
        fit: 'cover',
      },
      {
        name: 'thumbnail',
        width: 100,
        height: 100,
        fit: 'cover',
      },
    ],
  },
  admin: {
    useAsTitle: 'caption',
    group: 'Media',
  },
}
