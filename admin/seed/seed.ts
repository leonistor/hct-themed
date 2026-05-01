import { seed_partners } from './partners'

seed_partners().catch((err) => {
  console.error('Seed script failed:', err)
  process.exit(1)
})
