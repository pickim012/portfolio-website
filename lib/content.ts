import { asc, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  contactsContent,
  cvContent,
  exhibitions,
  homeContent,
  paintings,
} from '@/lib/db/schema'
import {
  type AdminExhibition,
  type AdminPainting,
  type ContactField,
  type CvSection,
  type PublicContact,
  type PublicExhibition,
  type PublicPainting,
  type SiteContent,
  defaultContactFields,
  defaultCvSections,
} from '@/lib/content-types'

// Static artist identity (the Home admin only edits the image + body text).
export { ARTIST_NAME } from '@/lib/site-config'
// Re-export shared types/constants so existing importers of '@/lib/content'
// keep working while '@/lib/content-types' stays the client-safe source.
export * from '@/lib/content-types'

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((v) => (typeof v === 'string' ? v : typeof v === 'object' && v && 'src' in v ? String((v as { src: unknown }).src) : ''))
    .filter(Boolean)
}

function contactHref(id: string, value: string): string | undefined {
  if (!value) return undefined
  if (id === 'email') return `mailto:${value}`
  if (id === 'instagram') {
    if (value.startsWith('http')) return value
    const handle = value.replace(/^@/, '')
    return `https://instagram.com/${handle}`
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Front-end read: assembles the entire published site from the database.
// ---------------------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
  const [homeRows, exhibitionRows, paintingRows, cvRows, contactRows] =
    await Promise.all([
      db.select().from(homeContent).limit(1),
      db.select().from(exhibitions).orderBy(asc(exhibitions.sortOrder), asc(exhibitions.createdAt)),
      db
        .select()
        .from(paintings)
        .orderBy(desc(paintings.year), asc(paintings.sortOrder), asc(paintings.createdAt)),
      db.select().from(cvContent).limit(1),
      db.select().from(contactsContent).limit(1),
    ])

  const home = homeRows[0]
    ? { imageSrc: homeRows[0].imageUrl, body: homeRows[0].body }
    : { imageSrc: '', body: '' }

  const publishedExhibitions: PublicExhibition[] = exhibitionRows
    .filter((e) => e.published)
    .map((e) => ({
      id: e.id,
      kind: e.kind === 'group' ? 'group' : 'solo',
      title: e.title,
      date: e.dateText,
      gallery: e.gallery,
      address: e.address,
      images: toStringArray(e.images),
    }))

  const paintingsByYear: Record<string, PublicPainting[]> = {}
  for (const p of paintingRows) {
    const key = String(p.year)
    if (!paintingsByYear[key]) paintingsByYear[key] = []
    paintingsByYear[key].push({
      id: p.id,
      title: p.title,
      details: p.details,
      images: toStringArray(p.images),
    })
  }
  const paintingYears = Object.keys(paintingsByYear).sort((a, b) => Number(b) - Number(a))

  const cvSections = (cvRows[0]?.sections as CvSection[] | undefined) ?? defaultCvSections()
  const cv = cvSections
    .filter((s) => s.visible && (s.content.trim() !== '' || s.kind === 'fixed'))
    .map((s) => ({ id: s.id, label: s.label, content: s.content }))

  const contactFields =
    (contactRows[0]?.fields as ContactField[] | undefined) ?? defaultContactFields()
  const contacts: PublicContact[] = contactFields
    .filter((f) => f.visible && f.value.trim() !== '')
    .map((f) => ({
      id: f.id,
      kind: f.id === 'email' ? 'email' : f.id === 'instagram' ? 'instagram' : 'custom',
      label: f.label,
      value: f.value,
      href: contactHref(f.id, f.value),
    }))

  return { home, exhibitions: publishedExhibitions, paintingsByYear, paintingYears, cv, contacts }
}

// ---------------------------------------------------------------------------
// Admin reads: return ALL rows (including hidden) to pre-fill the editor.
// ---------------------------------------------------------------------------
export async function getHomeForAdmin(): Promise<{ imageUrl: string; body: string }> {
  const rows = await db.select().from(homeContent).limit(1)
  return rows[0]
    ? { imageUrl: rows[0].imageUrl, body: rows[0].body }
    : { imageUrl: '', body: '' }
}

export async function getExhibitionsForAdmin(): Promise<AdminExhibition[]> {
  const rows = await db
    .select()
    .from(exhibitions)
    .orderBy(asc(exhibitions.sortOrder), asc(exhibitions.createdAt))
  return rows.map((e) => ({
    id: e.id,
    kind: e.kind === 'group' ? 'group' : 'solo',
    title: e.title,
    date: e.dateText,
    gallery: e.gallery,
    address: e.address,
    images: toStringArray(e.images),
    published: e.published,
    sortOrder: e.sortOrder,
  }))
}

export async function getPaintingsForAdmin(): Promise<AdminPainting[]> {
  const rows = await db
    .select()
    .from(paintings)
    .orderBy(desc(paintings.year), asc(paintings.sortOrder), asc(paintings.createdAt))
  return rows.map((p) => ({
    id: p.id,
    year: p.year,
    date: p.dateText,
    title: p.title,
    details: p.details,
    images: toStringArray(p.images),
    sortOrder: p.sortOrder,
  }))
}

export async function getCvForAdmin(): Promise<CvSection[]> {
  const rows = await db.select().from(cvContent).limit(1)
  return (rows[0]?.sections as CvSection[] | undefined) ?? defaultCvSections()
}

export async function getContactsForAdmin(): Promise<ContactField[]> {
  const rows = await db.select().from(contactsContent).limit(1)
  return (rows[0]?.fields as ContactField[] | undefined) ?? defaultContactFields()
}
