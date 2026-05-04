'use client'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'

export const CopyText: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField({ path })

  return (
    <Button onClick={() => navigator.clipboard.writeText(value as string)}>
      Copy to clipboard
    </Button>
  )
}
