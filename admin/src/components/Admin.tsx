import { Button } from '@payloadcms/ui'
import type { CollectionSlug, Payload } from 'payload'

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

  return (
    <>
      <Button buttonStyle="pill">
        {partners_published.totalDocs} + {partners_unpublished.totalDocs} Partners
      </Button>
    </>
  )
}
