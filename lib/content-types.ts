// Pure types + constants shared by server and client. NO database imports here
// so client components can safely import from this module.

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

// A single CV link item (rendered as a clickable link at the bottom of the CV).
export type CvLink = {
  id: string
  title: string // text shown on the front-end
  url: string // destination
}

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
  about: string
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
  cvIntro: string
  cv: { id: string; label: string; content: string }[]
  cvLinks: CvLink[]
  contacts: PublicContact[]
}

// ---------------------------------------------------------------------------
// Admin (editor) content types
// ---------------------------------------------------------------------------
export type AdminExhibition = {
  id: number
  kind: 'solo' | 'group'
  title: string
  date: string
  gallery: string
  address: string
  images: string[]
  about: string
  published: boolean
  sortOrder: number
}

export type ExhibitionInput = {
  kind: 'solo' | 'group'
  title: string
  date: string
  gallery: string
  address: string
  images: string[]
  about: string
  published: boolean
}

export type AdminPainting = {
  id: number
  year: number
  date: string
  title: string
  details: string
  images: string[]
  sortOrder: number
}

export type PaintingInput = {
  year: number
  date: string
  title: string
  details: string
  images: string[]
}
