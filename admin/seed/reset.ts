import config from '@payload-config'
import { exit, stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const rl = createInterface({ input: stdin, output: stdout })
const answer = await rl.question('You sure? (y/n) ')
rl.close()
if (answer.toLowerCase() !== 'y') exit(0)

await payload.delete({ collection: 'partners', where: {} })
await payload.delete({ collection: 'media', where: {} })
await payload.delete({ collection: 'customers', where: {} })
exit(0)
