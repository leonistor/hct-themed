import config from '@payload-config'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import path from 'path'

import imp_materials from './materials.json'

export async function seed_materials() {
  const payload = await getPayload({ config })

  const existingMaterials = await payload.find({
    collection: 'materials',
    limit: 0,
    pagination: false,
  })

  if (existingMaterials.docs.length > 0) {
    payload.logger.info(`Found ${existingMaterials.docs.length} existing materials, skipping seed.`)
    return
  }

  for (const material of imp_materials) {
    const { denumire, denumire_en, descriere, id, imagine, slug } = material
    const imageFilePath = path.resolve(__dirname, `./imgs/materials/${imagine}`)

    try {
      let uploadedImage: number | undefined

      if (existsSync(imageFilePath)) {
        const image = await payload.create({
          collection: 'media',
          data: { caption: `Imagine ${denumire}`, kind: 'illustration' },
          filePath: imageFilePath,
        })
        uploadedImage = image.id
      } else {
        payload.logger.warn(
          `Imagine ${imagine} not found at ${imageFilePath}, creating material without image`,
        )
      }

      const created = await payload.create({
        collection: 'materials',
        data: {
          code: slug,
          description: descriere,
          illustration: uploadedImage,
          name: denumire,
          name_en: denumire_en,
        },
      })

      payload.logger.info(`Created material: ${created.id}`)
    } catch (err) {
      const message = `Failed to create material "${denumire}": ${err instanceof Error ? err.message : String(err)}`
      payload.logger.error(message)
    }
  }

  payload.logger.info('Seeding materials completed successfully')

  return
}
