import type { Metadata } from "next"
import { requireAdmin } from "@/lib/require-admin"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side guard: protects every dashboard page even if middleware is bypassed.
  await requireAdmin()

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <AdminSidebar />
      {/* Fixed sidebar is 16rem wide; offset the content so it never overlaps. */}
      <div className="pl-64">
        <main className="mx-auto max-w-4xl px-8 py-10">{children}</main>
      </div>
    </div>
  )
}
