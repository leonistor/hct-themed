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
  const partners_unpublished = partners_counts.unpublished

  const customers_counts = await getPublishedUnpublished('customers')
  const customers_unpublished = customers_counts.unpublished

  const products_counts = await getPublishedUnpublished('products')
  const products_unpublished = products_counts.unpublished

  const projects_counts = await getPublishedUnpublished('projects')
  const projects_unpublished = projects_counts.unpublished

  return (
    <div className="overview">
      Unpublished:
      <OverviewButton name="partners" count_unpublished={partners_unpublished.totalDocs} />
      <OverviewButton name="customers" count_unpublished={customers_unpublished.totalDocs} />
      <OverviewButton name="products" count_unpublished={products_unpublished.totalDocs} />
      <OverviewButton name="projects" count_unpublished={projects_unpublished.totalDocs} />
    </div>
  )
}

function OverviewButton({ name, count_unpublished }: { name: string; count_unpublished: number }) {
  return (
    <Button el="link" to={`/admin/collections/${name}`} buttonStyle="pill">
      {capitalizeFirstLetter(name)}: {count_unpublished}
    </Button>
  )
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
