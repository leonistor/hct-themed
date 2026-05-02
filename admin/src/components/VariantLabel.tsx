'use client'

import { useRowLabel } from '@payloadcms/ui'

export const VariantLabel = () => {
  const { data, rowNumber } = useRowLabel<{ code?: string }>()

  const defaultLabel = `Variant ${String(rowNumber).padStart(2, '0')}`
  const customLabel = `${data.code || defaultLabel}`

  return <div>{customLabel}</div>
}
