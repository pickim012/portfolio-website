import { PageHeader } from "@/components/admin/PageHeader"

export default function AdminExhibitionsPage() {
  return (
    <div>
      <PageHeader
        title="Exhibitions"
        description="Add a new exhibition or edit existing ones."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ActionCard
          title="Upload"
          description="Create and publish a new exhibition."
          disabled
        />
        <ActionCard
          title="Edit"
          description="Update or remove existing exhibitions."
          disabled
        />
      </div>
    </div>
  )
}

function ActionCard({
  title,
  description,
  disabled,
}: {
  title: string
  description: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex flex-col items-start rounded-xl border border-neutral-200 bg-white p-6 text-left transition-colors hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-neutral-200"
    >
      <span className="text-base font-semibold text-neutral-900">{title}</span>
      <span className="mt-1 text-sm text-neutral-500">{description}</span>
    </button>
  )
}
