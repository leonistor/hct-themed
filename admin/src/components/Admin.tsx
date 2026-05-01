import { Button } from '@payloadcms/ui'
import type { CollectionSlug, Payload } from 'payload'
import './Admin.scss'

export async function Overview({ payload }: { payload: Payload }) {
  const getPublishedUnpublished = async (collection: CollectionSlug) => {
    const [published, unpublished] = await Promise.all([
      payload.count({ collection, where: { published: { equals: true } } }),
      payload.count({ collection, where: { published: { equals: false } } }),
    ])
    return { published, unpublished }
  }

  const partners_counts = await getPublishedUnpublished('partners')
  const partners_published = partners_counts.published
  const partners_unpublished = partners_counts.unpublished

  const customers_counts = await getPublishedUnpublished('customers')
  const customers_published = customers_counts.published
  const customers_unpublished = customers_counts.unpublished

  return (
    <div className="overview">
      <OverviewButton
        name="partners"
        count_published={partners_published.totalDocs}
        count_unpublished={partners_unpublished.totalDocs}
      />
      <OverviewButton
        name="customers"
        count_published={customers_published.totalDocs}
        count_unpublished={customers_unpublished.totalDocs}
      />
    </div>
  )
}

function OverviewButton({
  name,
  count_published,
  count_unpublished,
}: {
  name: string
  count_published: number
  count_unpublished: number
}) {
  return (
    <Button el="link" to="/collections" buttonStyle="pill">
      {capitalizeFirstLetter(name)}: {count_published}
      {count_unpublished ? ` + ${count_unpublished}` : ''}
    </Button>
  )
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
