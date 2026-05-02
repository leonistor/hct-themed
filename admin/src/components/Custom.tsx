import type { DefaultServerCellComponentProps } from 'payload'

import { CheckIcon } from '@payloadcms/ui'
import Image from 'next/image'

export const Published: React.FC<DefaultServerCellComponentProps> = ({
  cellData,
}: DefaultServerCellComponentProps) => {
  return <div>{cellData ? <CheckIcon /> : null}</div>
}

export const ImageCell: React.FC<DefaultServerCellComponentProps> = async ({
  cellData,
  payload,
}: DefaultServerCellComponentProps) => {
  const media = await payload.findByID({
    collection: 'media',
    id: cellData,
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '120px',
        height: '60px',
      }}
    >
      <Image
        src={media.url!}
        alt={media.caption ?? ''}
        fill
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
