import { PageHeader } from "@/components/admin/PageHeader"
import { ContactsEditor } from "@/components/admin/ContactsEditor"
import { getContactsForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function AdminContactsPage() {
  const initial = await getContactsForAdmin()
  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Edit contact details. Toggle visibility and use custom sections for anything extra."
      />
      <ContactsEditor initial={initial} />
    </div>
  )
}
