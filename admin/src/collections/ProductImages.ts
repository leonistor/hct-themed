import type { CollectionConfig } from 'payload'
import { default_image_sizes, default_pagination } from './common'

export const ProductImages: CollectionConfig = {
  slug: 'product-images',
  access: { read: () => true },
  enableQueryPresets: true,
  folders: true,
  fields: [
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: '../web/src/assets/payload/products',
    displayPreview: true,
    adminThumbnail: 'thumbnail',
    imageSizes: default_image_sizes,
  },
  admin: {
    group: 'Content',
    pagination: default_pagination,
  },
}
