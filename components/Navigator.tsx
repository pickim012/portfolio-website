'use client'

import { breadcrumb, type Route } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function Navigator({
  route,
  className,
}: {
  route: Route
  className?: string
}) {
  const segments = breadcrumb(route)

  return (
    <nav
      aria-label="Current location"
      className={cn(
        'select-none text-sm leading-[1.3] tracking-wide text-secondary-ink',
        className,
      )}
    >
      {segments.map((segment) => (
        <span key={segment} className="mr-2 last:mr-0">
          {`/${segment}`}
        </span>
      ))}
    </nav>
  )
}
