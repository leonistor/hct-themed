import { seed_partners } from './partners'
import { seed_customers } from './customers'
import { seed_categories } from './categories'
import { seed_materials } from './materials'
import { seed_folders } from './folders'

await seed_partners()
await seed_folders()
await seed_customers()
await seed_categories()
await seed_materials()

process.exit(0)
