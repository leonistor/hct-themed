import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'title', type: 'text', required: true },
    {
      name: 'content',
      type: 'code',
      admin: {
        language: 'markdown',
        editorOptions: {},
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        components: { Cell: 'src/components/Custom#Published' },
      },
    },
  ],
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    pagination: default_pagination,
  },
}
