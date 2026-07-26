'use client'

import { breadcrumb, type Route } from '@/lib/navigation'

export function Navigator({ route }: { route: Route }) {
  const segments = breadcrumb(route)

  return (
    <nav
      aria-label="Current location"
      className="pointer-events-none fixed right-5 top-7 z-30 select-none text-sm tracking-wide text-secondary-ink md:right-10 md:top-[60px]"
    >
      {segments.map((segment) => (
        <span key={segment} className="mr-2 last:mr-0">
          {`/${segment}`}
        </span>
      ))}
    </nav>
  )
}
