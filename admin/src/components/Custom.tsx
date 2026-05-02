import type { DefaultServerCellComponentProps } from 'payload'

import { CheckIcon } from '@payloadcms/ui'

export const Published: React.FC<DefaultServerCellComponentProps> = ({
  cellData,
}: DefaultServerCellComponentProps) => {
  return <div>{cellData ? <CheckIcon /> : null}</div>
}
