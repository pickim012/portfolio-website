import { PageHeader } from "@/components/admin/PageHeader"
import { CvEditor } from "@/components/admin/CvEditor"
import { getCvForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminCvPage() {
  const initial = await getCvForAdmin()
  return (
    <div>
      <PageHeader
        title="CV"
        description="Edit CV sections. Toggle visibility and use custom sections for anything extra."
      />
      <CvEditor initial={initial} />
    </div>
  )
}
