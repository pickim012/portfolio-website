import { PageHeader } from "@/components/admin/PageHeader"
import { HomeEditor } from "@/components/admin/HomeEditor"
import { getHomeForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminHomePage() {
  const initial = await getHomeForAdmin()
  return (
    <div>
      <PageHeader
        title="Home"
        description="Edit the image and text shown on your website's homepage."
      />
      <HomeEditor initial={initial} />
    </div>
  )
}
