import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  orderable: true,
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'name_en', type: 'text' },
    { name: 'description', type: 'textarea', admin: { disableListColumn: true, rows: 5 } },
    { name: 'description_en', type: 'textarea', admin: { disableListColumn: true, rows: 5 } },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      admin: { disableListColumn: true },
    },
    {
      name: 'illustration',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: {
        appearance: 'drawer',
        position: 'sidebar',
        components: {
          Cell: 'src/components/Custom#ImageCell',
        },
      },
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'category',
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
  },
}
