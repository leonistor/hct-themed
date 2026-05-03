import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

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
    { name: 'code', type: 'text', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        components: { Cell: 'src/components/Custom#Published' },
      },
    },
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
        appearance: 'select',
        position: 'sidebar',
        isSortable: false,
        components: { Cell: 'src/components/Custom#ImageCell' },
      },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    pagination: default_pagination,
  },
}
