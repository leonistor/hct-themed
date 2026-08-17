import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'
import { sanitizeUploadFilename } from '../utils/sanitizeUploadFilename'

const staticDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..', 'web/src/assets/payload')

const payload = await getPayload({ config })
const media = await payload.find({
  collection: 'media',
  depth: 0,
  limit: 0,
  pagination: false,
  where: {
    kind: {
      equals: 'projects',
    },
  },
})

let migrated = 0

for (const item of media.docs) {
  if (!item.filename || /^[a-zA-Z0-9._-]+$/.test(item.filename)) continue

  const sourcePath = path.join(staticDir, item.filename)
  const data = await fs.readFile(sourcePath)
  const updated = await payload.update({
    collection: 'media',
    id: item.id,
    data: {
      caption: item.caption,
      kind: item.kind,
      published: item.published,
    },
    file: {
      data,
      mimetype: item.mimeType || 'application/octet-stream',
      name: sanitizeUploadFilename(item.filename),
      size: data.byteLength,
    },
    depth: 0,
    overrideAccess: true,
  })

  console.log(`${item.filename} -> ${updated.filename}`)
  migrated += 1
}

console.log(`Migrated ${migrated} media file${migrated === 1 ? '' : 's'}.`)
process.exit(0)
