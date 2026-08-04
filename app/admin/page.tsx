import type { Metadata } from "next"
import { requireAdmin } from "@/lib/require-admin"
import { logout } from "./actions"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  await requireAdmin()

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              You are signed in.
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              Log Out
            </button>
          </form>
        </header>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-600">
            {"This is a placeholder. Dashboard content will be built in the next step."}
          </p>
        </section>
      </div>
    </main>
  )
}
