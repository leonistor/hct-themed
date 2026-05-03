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
    { name: 'description', type: 'textarea', admin: { disableListColumn: true } },
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
        components: { Cell: 'src/components/Custom#ImageCell' },
      },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
  },
}
