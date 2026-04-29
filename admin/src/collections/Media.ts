import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
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
        { label: 'Video', value: 'video' },
        { label: 'Product', value: 'product' },
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
  },
}
