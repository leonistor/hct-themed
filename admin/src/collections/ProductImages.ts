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
      allowList: [
        { hostname: 'www.panizzolo.com' },
        { hostname: 'tecnoecology.com' },
        { hostname: 'mistra.cz' },
        { hostname: 'www.holmatro.com' },
        { hostname: 'www.bronneberg-recycling.co.uk' },
        { hostname: 'www.iris-mec.com' },
        { hostname: 'husmann-umwelt-technik.de' },
        { hostname: 'www.wolfshredders.com' },
        { hostname: 'www.pressebull.it' },
      ],
    },
  },
  admin: {
    group: 'Content',
    pagination: default_pagination,
    groupBy: true,
  },
}
