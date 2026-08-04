"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/app/admin/actions"

type NavLink = { label: string; href: string }
type NavGroup = { label: string; children: NavLink[] }
type NavItem = NavLink | NavGroup

const NAV: NavItem[] = [
  { label: "Home", href: "/admin/home" },
  {
    label: "Works",
    children: [
      { label: "Exhibitions", href: "/admin/exhibitions" },
      { label: "Paintings", href: "/admin/paintings" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "CV", href: "/admin/cv" },
      { label: "Contacts", href: "/admin/contacts" },
    ],
  },
]

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item
}

function NavLinkItem({
  href,
  label,
  active,
  nested,
}: {
  href: string
  label: string
  active: boolean
  nested?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "block rounded-md px-3 py-2 text-sm transition-colors",
        nested ? "ml-3" : "",
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
      ].join(" ")}
    >
      {label}
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Brand */}
      <div className="border-b border-neutral-200 px-6 py-5">
        <p className="text-sm font-semibold tracking-tight text-neutral-900">
          Kim, Yeadam
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">Content Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            if (!isGroup(item)) {
              return (
                <li key={item.href}>
                  <NavLinkItem
                    href={item.href}
                    label={item.label}
                    active={pathname === item.href}
                  />
                </li>
              )
            }
            return (
              <li key={item.label} className="mt-3 first:mt-0">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {item.label}
                </p>
                <ul className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavLinkItem
                        href={child.href}
                        label={child.label}
                        active={pathname === child.href}
                        nested
                      />
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Log out */}
      <div className="border-t border-neutral-200 p-3">
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Log Out
          </button>
        </form>
      </div>
    </aside>
  )
}
