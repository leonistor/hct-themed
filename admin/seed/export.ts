// TODO: export image files
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const all_collections = payload.config.collections.filter((c) => !c.admin.hidden).map((c) => c.slug)

console.debug(all_collections)

process.exit(0)
