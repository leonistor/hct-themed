import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Partners } from './collections/Partners'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Materials } from './collections/Materials'
import { ProductImages } from './collections/ProductImages'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  logger: {
    options: {
      level: 'error',
    },
  },
  telemetry: false,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@test.com',
            password: 'test1234',
            prefillOnly: false,
          }
        : false,
    components: {
      graphics: {
        Icon: 'src/components/Logo',
        Logo: 'src/components/Logo',
      },
      beforeDashboard: ['src/components/Admin#Overview'],
    },
  },
  collections: [
    Users,
    Media,
    Partners,
    Categories,
    Customers,
    Materials,
    Products,
    ProductImages,
    Projects,
    Pages,
  ],
  defaultDepth: 2,
  folders: {
    browseByFolder: true,
  },
  plugins: [
    importExportPlugin({
      debug: true,
      collections: [
        { slug: 'products', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'product-images', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'media', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'partners', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'categories', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'customers', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'materials', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'projects', export: { disableJobsQueue: true, format: 'json' } },
        { slug: 'pages', export: { disableJobsQueue: true, format: 'json' } },
      ],
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '22db8265bed0b27620bba651',
  typescript: {
    outputFile: path.resolve(dirname, '../../shared/types/payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:../db/hct.db',
    },
    wal: true,
    transactionOptions: {},
  }),
  sharp,
  cors: '*',
})
