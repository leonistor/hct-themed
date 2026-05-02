import config from '@payload-config'
import { getPayload } from 'payload'

export async function seed_folders() {
  const payload = await getPayload({ config })

  const existingPartners = await payload.find({
    collection: 'partners',
    limit: 0,
    pagination: false,
  })

  for (const partner of existingPartners.docs) {
    await payload.create({
      collection: 'payload-folders',
      data: {
        name: partner.name,
        folderType: ['products', 'product-images'],
      },
    })
  }

  payload.logger.info('Seeding folders completed successfully')

  return
}
