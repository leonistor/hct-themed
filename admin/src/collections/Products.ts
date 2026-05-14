import type { CollectionConfig } from 'payload'
import { default_pagination } from './common'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  access: { read: () => true },
  enableQueryPresets: true,
  folders: true,
  orderable: true,
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      admin: { description: 'partner-code--name-with-space-to-dash', disableListColumn: true },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'name_en', type: 'text', admin: { disableListColumn: true } },
    { name: 'description', type: 'textarea', admin: { disableListColumn: true, rows: 5 } },
    { name: 'page', type: 'text', admin: { disableListColumn: true, position: 'sidebar' } },
    {
      name: 'url',
      type: 'text',
      admin: {
        disableListColumn: true,
        components: { afterInput: ['src/components/Copy.tsx#CopyText'] },
      },
    },
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
    {
      name: 'promoted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Highlighted with new badge',
        components: { Cell: 'src/components/Custom#Published' },
      },
    },
    {
      name: 'variants',
      type: 'array',
      required: false,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'code', type: 'text', required: true, admin: { width: '20%' } },
            { name: 'feature', type: 'text', admin: { width: '20%' } },
            { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        {
          type: 'row',
          fields: [{ name: 'description', type: 'textarea', admin: { rows: 3 } }],
        },
        {
          type: 'row',
          fields: [
            // TODO: select page from a list
            { name: 'page', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
      admin: {
        disableListColumn: true,
        // initCollapsed: true,
        components: { RowLabel: 'src/components/VariantLabel#VariantLabel' },
      },
    },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: false,
      index: true,
      admin: { position: 'sidebar', allowCreate: false, allowEdit: false },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      index: true,
      admin: { position: 'sidebar', allowCreate: false, allowEdit: false },
    },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
      index: true,
      admin: { disableListColumn: true, position: 'sidebar', allowCreate: false, allowEdit: false },
    },
    {
      name: 'main_image',
      type: 'relationship',
      relationTo: 'product-images',
      hasMany: false,
      admin: { appearance: 'drawer', position: 'sidebar' },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'product-images',
      hasMany: true,
      admin: { appearance: 'drawer', disableListColumn: true },
    },
  ],
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    groupBy: true,
    pagination: default_pagination,
  },
}
