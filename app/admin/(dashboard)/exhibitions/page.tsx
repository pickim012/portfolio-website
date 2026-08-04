import { ExhibitionsManager } from "@/components/admin/ExhibitionsManager"
import { getExhibitionsForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminExhibitionsPage() {
  const exhibitions = await getExhibitionsForAdmin()
  return <ExhibitionsManager exhibitions={exhibitions} />
}
