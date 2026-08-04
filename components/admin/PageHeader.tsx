export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="border-b border-neutral-200 pb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 text-sm text-neutral-500">{description}</p>
      )}
    </header>
  )
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
      {children}
    </div>
  )
}
