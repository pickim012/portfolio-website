import { Layout } from '@/components/Layout'
import { getSiteContent } from '@/lib/content'

// Always reflect the latest published content from the database.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getSiteContent()
  return <Layout content={content} />
}
