import { getPayload } from 'payload'

import config from '../payload.config'
import locations from '../../seed/customers-location.json'

// DB names that differ from the JSON source names. The JSON is the source of truth.
const nameAliases: Record<string, string> = {
  'Salubritate Deva': 'Salubrizare Deva',
}

const normalize = (name: string) => name.trim().toLowerCase()

const payload = await getPayload({ config })

const customers = await payload.find({
  collection: 'customers',
  depth: 0,
  limit: 0,
  pagination: false,
})

const byName = new Map<string, (typeof customers.docs)[number]>()
for (const customer of customers.docs) {
  byName.set(normalize(customer.name), customer)
}

let updated = 0
let skipped = 0

for (const { name, map_lat, map_lng } of locations) {
  const dbName = nameAliases[name] ?? name
  const customer = byName.get(normalize(dbName))

  if (!customer) {
    payload.logger.warn(`No customer found for "${name}" (db name: "${dbName}"), skipping.`)
    skipped += 1
    continue
  }

  await payload.update({
    collection: 'customers',
    id: customer.id,
    data: { map_lat, map_lng },
    depth: 0,
    overrideAccess: true,
  })

  console.log(`${customer.name} -> ${map_lat}, ${map_lng}`)
  updated += 1
}

console.log(`Updated ${updated} customer${updated === 1 ? '' : 's'}, skipped ${skipped}.`)
process.exit(0)
