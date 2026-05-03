import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: 'Material',
    plural: 'Materials',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  orderable: true,
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'name_en', type: 'text', admin: { disableListColumn: true } },
    { name: 'description', type: 'textarea', required: false },
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
    pagination: default_pagination,
  },
}
