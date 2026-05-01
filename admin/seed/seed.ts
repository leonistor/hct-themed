import { seed_partners } from './partners'
import { seed_customers } from './customers'

await seed_partners()
await seed_customers()

process.exit(0)
