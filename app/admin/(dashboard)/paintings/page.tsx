import { PaintingsManager } from "@/components/admin/PaintingsManager"
import { getPaintingsForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminPaintingsPage() {
  const paintings = await getPaintingsForAdmin()
  return <PaintingsManager paintings={paintings} />
}
