import type { DefaultServerCellComponentProps } from 'payload'

export const Published: React.FC<DefaultServerCellComponentProps> = ({
  cellData,
}: DefaultServerCellComponentProps) => {
  return <div>{cellData ? <span>YES</span> : null}</div>
}
