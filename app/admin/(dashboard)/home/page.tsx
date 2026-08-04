import { PageHeader, Placeholder } from "@/components/admin/PageHeader"

export default function AdminHomePage() {
  return (
    <div>
      <PageHeader
        title="Home"
        description="Edit the content shown on your website's homepage."
      />
      <Placeholder>
        The homepage editing form will go here. Tell me which fields you want to
        manage (intro text, featured image, etc.) and I&apos;ll build it next.
      </Placeholder>
    </div>
  )
}
