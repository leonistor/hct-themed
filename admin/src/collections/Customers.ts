import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Customer',
    plural: 'Customers',
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
    { name: 'location', type: 'text', required: false, defaultValue: 'Romania' },
    { name: 'map_lat', type: 'number', required: false, defaultValue: 45.657974 },
    { name: 'map_lng', type: 'number', required: false, defaultValue: 25.601198 },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: { appearance: 'drawer' },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
  },
}
