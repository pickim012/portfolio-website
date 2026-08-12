import { TextsEditor } from "@/components/admin/TextsEditor"
import { getTextsForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminTextsPage() {
  const links = await getTextsForAdmin()
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Texts</h1>
      <p className="mt-2 text-sm text-neutral-500">Manage texts shown under Works.</p>
      <TextsEditor initial={links} />
    </>
  )
}
