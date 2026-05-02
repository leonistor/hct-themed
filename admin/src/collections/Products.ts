import type { CollectionConfig } from 'payload'

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
    { name: 'name_en', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: false },
    { name: 'link', type: 'text' },
    { name: 'url', type: 'text' },
    { name: 'published', type: 'checkbox', defaultValue: false },
    {
      name: 'variants',
      type: 'array',
      required: false,
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'link', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: false },
    { name: 'category', type: 'relationship', relationTo: 'categories', hasMany: false },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
      required: false,
    },
    {
      name: 'main_image',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: { appearance: 'drawer' },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: { appearance: 'drawer' },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
}
