import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  orderable: true,
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        components: { Cell: 'src/components/Custom#Published' },
      },
    },
    { name: 'description', type: 'textarea', required: false, admin: { rows: 10 } },
    { name: 'page', type: 'text', admin: { disableListColumn: true, position: 'sidebar' } },
    {
      name: 'illustration',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: { appearance: 'drawer', position: 'sidebar' },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    pagination: default_pagination,
  },
}
