import config from '@payload-config'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import path from 'path'

import imp_categories from './categories.json'

export async function seed_categories() {
  const payload = await getPayload({ config })

  const existingCategories = await payload.find({
    collection: 'categories',
    limit: 0,
    pagination: false,
  })

  if (existingCategories.docs.length > 0) {
    payload.logger.info(
      `Found ${existingCategories.docs.length} existing categories, skipping seed.`,
    )
    return
  }

  for (const category of imp_categories) {
    const { id, imagine, nume, slug } = category
    const imageFilePath = path.resolve(__dirname, `./imgs/categories/${imagine}`)

    try {
      let uploadedImage: number | undefined

      if (existsSync(imageFilePath)) {
        const image = await payload.create({
          collection: 'media',
          data: { caption: `Imagine ${nume}`, kind: 'illustration' },
          filePath: imageFilePath,
        })
        uploadedImage = image.id
      } else {
        payload.logger.warn(
          `Imagine ${imagine} not found at ${imageFilePath}, creating category without image`,
        )
      }

      const created = await payload.create({
        collection: 'categories',
        data: {
          code: slug,
          illustration: uploadedImage,
          name: nume,
          published: true,
        },
      })

      payload.logger.info(`Created category: ${created.id}`)
    } catch (err) {
      const message = `Failed to create category "${nume}": ${err instanceof Error ? err.message : String(err)}`
      payload.logger.error(message)
    }
  }

  payload.logger.info('Seeding categories completed successfully')

  return
}
