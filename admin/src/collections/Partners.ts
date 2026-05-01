import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partners',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  orderable: true,
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'published', type: 'checkbox', defaultValue: false },
    { name: 'description', type: 'textarea', required: false },
    { name: 'url', type: 'text', required: false },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: {
        allowCreate: false,
        allowEdit: false,
        appearance: 'drawer',
      },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    pagination: {
      defaultLimit: 20,
      limits: [20, 50, 100],
    },
  },
}
