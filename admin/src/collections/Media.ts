import type { CollectionConfig } from 'payload'
import { default_image_sizes, default_allow_list } from './common'
import { default_pagination } from './common'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  enableQueryPresets: true,
  folders: true,
  fields: [
    { name: 'caption', type: 'text' },
    {
      name: 'kind',
      type: 'radio',
      required: true,
      index: true,
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
    imageSizes: default_image_sizes,
    pasteURL: {
      allowList: default_allow_list,
    },
  },
  admin: {
    group: 'Content',
    groupBy: true,
    pagination: default_pagination,
  },
}
