import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

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
    { name: 'code', type: 'text', required: true, admin: { disableListColumn: true } },
    { name: 'name', type: 'text', required: true },
    { name: 'published', type: 'checkbox', defaultValue: false },
    { name: 'description', type: 'textarea', admin: { disableListColumn: true } },
    { name: 'url', type: 'text', required: false },
    { name: 'location', type: 'text', defaultValue: 'Romania' },
    { name: 'map_lat', type: 'number', defaultValue: 45.657974 },
    { name: 'map_lng', type: 'number', defaultValue: 25.601198 },
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
    pagination: default_pagination,
  },
}
