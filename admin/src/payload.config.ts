import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Partners } from './collections/Partners'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Materials } from './collections/Materials'
import { ProductImages } from './collections/ProductImages'
import { Products } from './collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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
      beforeDashboard: ['src/components/Admin#Overview'],
    },
  },
  collections: [Users, Media, Partners, Categories, Customers, Materials, Products, ProductImages],
  folders: {
    browseByFolder: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '22db8265bed0b27620bba651',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:../db/payload.db',
    },
    wal: true,
    transactionOptions: {},
  }),
  sharp,
  plugins: [],
  cors: '*',
})
