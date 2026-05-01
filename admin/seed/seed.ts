import config from '@payload-config'
import { existsSync } from 'fs'
import { getPayload } from 'payload'

import { Partner } from '@/payload-types'
import path from 'path'
import imp_partners from './partners.json'

const payload = await getPayload({ config })

const created_partneri = new Map<number, Partner>()
let result: Promise<void>[]

result = imp_partners.map(async (partner) => {
  const { cod, descriere, logo, nume, url } = partner
  let uploadedImage: number | undefined
  const imageFilePath = path.resolve(__dirname, `./imgs/partners/${logo}`)
  console.debug(imageFilePath)
  if (existsSync(imageFilePath)) {
    const image = await payload.create({
      collection: 'media',
      data: { caption: `Logo ${nume}`, kind: 'partners' },
      filePath: imageFilePath,
    })
    uploadedImage = image.id
  } else {
    payload.logger.error(`Logo ${logo} not found at ${imageFilePath}`)
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
  // lookup for produs
  created_partneri.set(created.id, created)
  payload.logger.info(`created partner: ${created.id}`)
})

await Promise.all(result)

payload.logger.info('Seeding completed successfully')
