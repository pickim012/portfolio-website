import { asc, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  contactsContent,
  cvContent,
  exhibitions,
  homeContent,
  paintings,
  textsContent,
} from '@/lib/db/schema'
import {
  type AdminExhibition,
  type AdminPainting,
  type ContactField,
  type CvLink,
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

function parseHomeImagePairs(imageUrl: string): { imageSrc: string; caption: string }[] {
  try {
    const parsed = JSON.parse(imageUrl)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item.imageSrc === 'string')
        .slice(0, 5)
        .map((item) => ({ imageSrc: item.imageSrc, caption: typeof item.caption === 'string' ? item.caption : '' }))
    }
  } catch {
    // Existing single-image values remain supported.
  }
  return imageUrl ? [{ imageSrc: imageUrl, caption: '' }] : []
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
  const [homeRows, exhibitionRows, paintingRows, cvRows, contactRows, textsRows] =
    await Promise.all([
      db.select().from(homeContent).limit(1),
      db.select().from(exhibitions).orderBy(asc(exhibitions.sortOrder), asc(exhibitions.createdAt)),
      db
        .select()
        .from(paintings)
        .orderBy(desc(paintings.year), asc(paintings.sortOrder), asc(paintings.createdAt)),
      db.select().from(cvContent).limit(1),
      db.select().from(contactsContent).limit(1),
      db.select().from(textsContent).limit(1),
    ])

  const homePairs = homeRows[0] ? parseHomeImagePairs(homeRows[0].imageUrl) : []
  const home = homeRows[0]
    ? { imageSrc: homePairs[0]?.imageSrc ?? '', body: homeRows[0].body, imagePairs: homePairs }
    : { imageSrc: '', body: '', imagePairs: [] }

  const textsLinks = ((textsRows[0]?.links as CvLink[] | undefined) ?? [])
    .filter((l) => l.title.trim() !== '' && l.url.trim() !== '')
    .map((l) => ({ id: l.id, title: l.title.trim(), url: l.url.trim() }))

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
      about: e.about ?? '',
      links: ((e.links as CvLink[] | undefined) ?? [])
        .filter((l) => l.title.trim() !== '' && l.url.trim() !== '')
        .map((l) => ({ id: l.id, title: l.title.trim(), url: l.url.trim() })),
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

  // Links section: keep admin order, drop entries missing a title or URL.
  const cvLinks = ((cvRows[0]?.links as CvLink[] | undefined) ?? [])
    .filter((l) => l.title.trim() !== '' && l.url.trim() !== '')
    .map((l) => ({ id: l.id, title: l.title.trim(), url: l.url.trim() }))

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

  return {
    textsLinks,
    home,
    exhibitions: publishedExhibitions,
    paintingsByYear,
    paintingYears,
    cvIntro: cvRows[0]?.intro ?? '',
    cv,
    cvLinks,
    contacts,
  }
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
    about: e.about ?? '',
    links: (e.links as CvLink[] | undefined) ?? [],
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

export async function getCvForAdmin(): Promise<{ intro: string; sections: CvSection[]; links: CvLink[] }> {
  const rows = await db.select().from(cvContent).limit(1)
  return {
    intro: rows[0]?.intro ?? '',
    sections: (rows[0]?.sections as CvSection[] | undefined) ?? defaultCvSections(),
    links: (rows[0]?.links as CvLink[] | undefined) ?? [],
  }
}

export async function getContactsForAdmin(): Promise<ContactField[]> {
  const rows = await db.select().from(contactsContent).limit(1)
  return (rows[0]?.fields as ContactField[] | undefined) ?? defaultContactFields()
}

export async function getTextsForAdmin(): Promise<CvLink[]> {
  const rows = await db.select().from(textsContent).limit(1)
  return (rows[0]?.links as CvLink[] | undefined) ?? []
}
