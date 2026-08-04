import { PageHeader, Placeholder } from "@/components/admin/PageHeader"

export default function AdminContactsPage() {
  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Edit the contact details shown on your website."
      />
      <Placeholder>
        The contacts editing form will go here. Let me know which fields you want
        to manage (email, Instagram, etc.) and I&apos;ll build it next.
      </Placeholder>
    </div>
  )
}
