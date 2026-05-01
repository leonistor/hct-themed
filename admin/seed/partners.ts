import config from '@payload-config'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import path from 'path'

import imp_partners from './partners.json'

export async function seed_partners() {
  const payload = await getPayload({ config })

  const existingPartners = await payload.find({
    collection: 'partners',
    limit: 0,
    pagination: false,
  })

  if (existingPartners.docs.length > 0) {
    payload.logger.info(`Found ${existingPartners.docs.length} existing partners, skipping seed.`)
    return
  }

  for (const partner of imp_partners) {
    const { cod, descriere, logo, nume, url } = partner
    const imageFilePath = path.resolve(__dirname, `./imgs/partners/${logo}`)

    try {
      let uploadedImage: number | undefined

      if (existsSync(imageFilePath)) {
        const image = await payload.create({
          collection: 'media',
          data: { caption: `Logo ${nume}`, kind: 'partners' },
          filePath: imageFilePath,
        })
        uploadedImage = image.id
      } else {
        payload.logger.warn(
          `Logo ${logo} not found at ${imageFilePath}, creating partner without logo`,
        )
      }

      const created = await payload.create({
        collection: 'partners',
        data: {
          code: cod,
          description: descriere,
          logo: uploadedImage,
          name: nume,
          url: url,
        },
      })

      payload.logger.info(`Created partner: ${created.id}`)
    } catch (err) {
      const message = `Failed to create partner "${nume}": ${err instanceof Error ? err.message : String(err)}`
      payload.logger.error(message)
    }
  }

  payload.logger.info('Seeding completed successfully')

  return
}
