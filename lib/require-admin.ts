import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

/**
 * Server-side guard for admin pages. Redirects to the login screen when there
 * is no valid session. Call at the top of every protected admin page/layout
 * so protection holds even if middleware is bypassed.
 */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login")
  }
}
