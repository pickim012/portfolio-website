import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

/**
 * Protects every /admin route. Unauthenticated requests are redirected to the
 * login page. The login page itself is always allowed so users can sign in.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page through without a session.
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const authed = await verifySessionToken(token)

  if (!authed) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
