import { getPayload } from 'payload'
import config from '@payload-config'
import { existsSync } from 'fs'

import imp_partners from './partners.json'

const payload = await getPayload({ config })
