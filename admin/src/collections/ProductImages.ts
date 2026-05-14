import type { CollectionConfig } from 'payload'
import { default_image_sizes, default_pagination, default_allow_list } from './common'

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
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
  ],
  upload: {
    staticDir: '../web/src/assets/payload/products',
    displayPreview: true,
    adminThumbnail: 'thumbnail',
    imageSizes: default_image_sizes,
    pasteURL: {
      allowList: default_allow_list,
    },
  },
  admin: {
    group: 'Content',
    pagination: default_pagination,
    groupBy: true,
  },
}
