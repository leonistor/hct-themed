import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  orderable: true,
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'name_en', type: 'text', admin: { disableListColumn: true } },
    { name: 'description', type: 'textarea', admin: { disableListColumn: true } },
    { name: 'page', type: 'text', admin: { disableListColumn: true } },
    { name: 'url', type: 'text', admin: { disableListColumn: true } },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        components: { Cell: 'src/components/Custom#Published' },
      },
    },
    {
      name: 'variants',
      type: 'array',
      required: false,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'code', type: 'text', required: true, admin: { width: '20%' } },
            { name: 'feature', type: 'text', admin: { width: '20%' } },
            { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        {
          type: 'row',
          fields: [{ name: 'description', type: 'textarea', admin: { rows: 3 } }],
        },
        {
          type: 'row',
          fields: [
            { name: 'page', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
      admin: { disableListColumn: true },
    },
    { name: 'partner', type: 'relationship', relationTo: 'partners', hasMany: false },
    { name: 'category', type: 'relationship', relationTo: 'categories', hasMany: false },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
      admin: { disableListColumn: true },
    },
    {
      name: 'main_image',
      type: 'relationship',
      relationTo: 'product-images',
      hasMany: false,
      admin: { appearance: 'drawer' },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'product-images',
      hasMany: true,
      admin: { appearance: 'drawer', disableListColumn: true },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    pagination: default_pagination,
  },
}
