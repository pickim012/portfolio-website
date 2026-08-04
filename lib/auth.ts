import "server-only"

/**
 * Minimal single-admin session auth.
 *
 * A session is a signed token: `${payload}.${signature}` where the signature
 * is an HMAC-SHA256 of the payload keyed with ADMIN_SESSION_SECRET. Everything
 * uses the Web Crypto API so the same helpers work in both the Node runtime
 * (server actions / route handlers) and the Edge runtime (middleware).
 */

export const SESSION_COOKIE = "admin_session"
// 7 days, in seconds.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const encoder = new TextEncoder()

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let str = ""
  for (const b of arr) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set")
  }
  return secret
}

/**
 * Constant-time-ish string comparison to avoid trivial timing leaks on the
 * credential check. Compares full length regardless of early mismatch.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

/** Validate a submitted email + password against the configured admin creds. */
export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL
  const expectedPassword = process.env.ADMIN_PASSWORD
  if (!expectedEmail || !expectedPassword) return false
  // Email is case-insensitive; password is exact.
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase())
  const passwordOk = safeEqual(password, expectedPassword)
  return emailOk && passwordOk
}

/** Create a signed session token valid until `issuedAt + SESSION_MAX_AGE`. */
export async function createSessionToken(): Promise<string> {
  const payload = base64url(encoder.encode(JSON.stringify({ sub: "admin", iat: Date.now() })))
  const key = await importKey(getSecret())
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return `${payload}.${base64url(sig)}`
}

/** Verify a session token's signature and expiry. Returns true if still valid. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const key = await importKey(getSecret())
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  if (!safeEqual(signature, base64url(expected))) return false

  try {
    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
          c.charCodeAt(0),
        ),
      ),
    ) as { sub?: string; iat?: number }
    if (json.sub !== "admin" || typeof json.iat !== "number") return false
    if (Date.now() - json.iat > SESSION_MAX_AGE * 1000) return false
    return true
  } catch {
    return false
  }
}
