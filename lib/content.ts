import { asc, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  contactsContent,
  cvContent,
  exhibitions,
  homeContent,
  paintings,
} from '@/lib/db/schema'

// Static artist identity (the Home admin only edits the image + body text).
export { ARTIST_NAME } from '@/lib/site-config'

// ---------------------------------------------------------------------------
// CV / Contacts section templates
// ---------------------------------------------------------------------------
export const CV_FIXED = [
  { id: 'solo', label: 'Solo Exhibitions' },
  { id: 'group', label: 'Group Exhibitions' },
  { id: 'education', label: 'Education' },
  { id: 'award', label: 'Award' },
] as const

export const CONTACT_FIXED = [
  { id: 'email', label: 'Email' },
  { id: 'instagram', label: 'Instagram' },
] as const

export const CUSTOM_SLOTS = 3

export type CvSection = {
  id: string
  kind: 'fixed' | 'custom'
  label: string // fixed: section name; custom: user-defined title
  visible: boolean
  content: string
}

export type ContactField = {
  id: string
  kind: 'fixed' | 'custom'
  label: string // fixed: 'Email' | 'Instagram'; custom: user-defined title
  visible: boolean
  value: string // fixed: the value; custom: free text content
}

// Default structures used when the singleton row has not been seeded yet.
export function defaultCvSections(): CvSection[] {
  const fixed: CvSection[] = CV_FIXED.map((s) => ({
    id: s.id,
    kind: 'fixed',
    label: s.label,
    visible: true,
    content: '',
  }))
  const custom: CvSection[] = Array.from({ length: CUSTOM_SLOTS }, (_, i) => ({
    id: `custom-${i + 1}`,
    kind: 'custom',
    label: '',
    visible: false,
    content: '',
  }))
  return [...fixed, ...custom]
}

export function defaultContactFields(): ContactField[] {
  const fixed: ContactField[] = CONTACT_FIXED.map((f) => ({
    id: f.id,
    kind: 'fixed',
    label: f.label,
    visible: true,
    value: '',
  }))
  const custom: ContactField[] = Array.from({ length: CUSTOM_SLOTS }, (_, i) => ({
    id: `custom-${i + 1}`,
    kind: 'custom',
    label: '',
    visible: false,
    value: '',
  }))
  return [...fixed, ...custom]
}

// ---------------------------------------------------------------------------
// Public (front-end) content types
// ---------------------------------------------------------------------------
export type PublicExhibition = {
  id: number
  kind: 'solo' | 'group'
  title: string
  date: string
  gallery: string
  address: string
  images: string[]
}

export type PublicPainting = {
  id: number
  title: string
  details: string
  images: string[]
}

export type PublicContact = {
  id: string
  kind: 'email' | 'instagram' | 'custom'
  label: string
  value: string
  href?: string
}

export type SiteContent = {
  home: { imageSrc: string; body: string }
  exhibitions: PublicExhibition[]
  paintingsByYear: Record<string, PublicPainting[]>
  paintingYears: string[]
  cv: { id: string; label: string; content: string }[]
  contacts: PublicContact[]
}

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
