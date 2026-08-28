import { Layout } from '@/components/Layout'
import { claimLandingImage, getSiteContent } from '@/lib/content'

// Always reflect the latest published content from the database.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getSiteContent()
  const landingImage = await claimLandingImage(content.home.imagePairs ?? [])
  return <Layout content={content} landingImage={landingImage} />
}
