import config from '@payload-config'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import path from 'path'

import imp_customers from './customers.json'

export async function seed_customers() {
  const payload = await getPayload({ config })

  const existingCustomers = await payload.find({
    collection: 'customers',
    limit: 0,
    pagination: false,
  })

  if (existingCustomers.docs.length > 0) {
    payload.logger.info(`Found ${existingCustomers.docs.length} existing customers, skipping seed.`)
    return
  }

  for (const customer of imp_customers) {
    const { id, descriere, locatie, nume, url, logo } = customer
    const imageFilePath = path.resolve(__dirname, `./imgs/customers/${logo}`)

    try {
      let uploadedImage: number | undefined

      if (existsSync(imageFilePath)) {
        const image = await payload.create({
          collection: 'media',
          data: { caption: `Logo ${nume}`, kind: 'customers' },
          filePath: imageFilePath,
        })
        uploadedImage = image.id
      } else {
        payload.logger.warn(
          `Logo ${logo} not found at ${imageFilePath}, creating customer without logo`,
        )
      }

      const created = await payload.create({
        collection: 'customers',
        data: {
          code: id,
          description: descriere,
          logo: uploadedImage,
          name: nume,
          url: url,
          location: locatie,
          published: true,
        },
      })

      payload.logger.info(`Created customer: ${created.id}`)
    } catch (err) {
      const message = `Failed to create customer "${nume}": ${err instanceof Error ? err.message : String(err)}`
      payload.logger.error(message)
    }
  }

  payload.logger.info('Seeding customers completed successfully')

  return
}
