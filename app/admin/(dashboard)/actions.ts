'use server'

import { and, asc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import {
  contactsContent,
  cvContent,
  exhibitions,
  homeContent,
  paintings,
} from '@/lib/db/schema'
import type {
  ContactField,
  CvLink,
  CvSection,
  ExhibitionInput,
  PaintingInput,
} from '@/lib/content-types'
import { assertAdmin } from '@/lib/require-admin'

// Revalidate both the live site and the admin pages after any write.
function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
export async function saveHome(input: { imageUrl: string; body: string }) {
  await assertAdmin()
  await db
    .insert(homeContent)
    .values({ id: 1, imageUrl: input.imageUrl, body: input.body, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: homeContent.id,
      set: { imageUrl: input.imageUrl, body: input.body, updatedAt: new Date() },
    })
  revalidateAll()
}

// ---------------------------------------------------------------------------
// Exhibitions
// ---------------------------------------------------------------------------
export async function createExhibition(input: ExhibitionInput) {
  await assertAdmin()
  // New items go to the TOP of their category: one below the current min order.
  const [{ min }] = await db
    .select({ min: sql<number>`coalesce(min(${exhibitions.sortOrder}), 0)` })
    .from(exhibitions)
    .where(eq(exhibitions.kind, input.kind))
  await db.insert(exhibitions).values({
    kind: input.kind,
    title: input.title,
    dateText: input.date,
    gallery: input.gallery,
    address: input.address,
    images: input.images,
    about: input.about,
    published: input.published,
    sortOrder: Number(min) - 1,
  })
  revalidateAll()
}

export async function updateExhibition(id: number, input: ExhibitionInput) {
  await assertAdmin()
  // Note: sortOrder is intentionally NOT changed — editing keeps its position.
  await db
    .update(exhibitions)
    .set({
      kind: input.kind,
      title: input.title,
      dateText: input.date,
      gallery: input.gallery,
      address: input.address,
      images: input.images,
      about: input.about,
      published: input.published,
    })
    .where(eq(exhibitions.id, id))
  revalidateAll()
}

export async function setExhibitionPublished(id: number, published: boolean) {
  await assertAdmin()
  await db.update(exhibitions).set({ published }).where(eq(exhibitions.id, id))
  revalidateAll()
}

export async function deleteExhibition(id: number) {
  await assertAdmin()
  await db.delete(exhibitions).where(eq(exhibitions.id, id))
  revalidateAll()
}

export async function reorderExhibitions(kind: 'solo' | 'group', orderedIds: number[]) {
  await assertAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(exhibitions)
        .set({ sortOrder: index })
        .where(and(eq(exhibitions.id, id), eq(exhibitions.kind, kind))),
    ),
  )
  revalidateAll()
}

// ---------------------------------------------------------------------------
// Paintings
// ---------------------------------------------------------------------------
export async function createPainting(input: PaintingInput) {
  await assertAdmin()
  // New items go to the TOP of their year group.
  const [{ min }] = await db
    .select({ min: sql<number>`coalesce(min(${paintings.sortOrder}), 0)` })
    .from(paintings)
    .where(eq(paintings.year, input.year))
  await db.insert(paintings).values({
    year: input.year,
    dateText: input.date,
    title: input.title,
    details: input.details,
    images: input.images,
    sortOrder: Number(min) - 1,
  })
  revalidateAll()
}

export async function updatePainting(id: number, input: PaintingInput) {
  await assertAdmin()
  await db
    .update(paintings)
    .set({
      year: input.year,
      dateText: input.date,
      title: input.title,
      details: input.details,
      images: input.images,
    })
    .where(eq(paintings.id, id))
  revalidateAll()
}

export async function deletePainting(id: number) {
  await assertAdmin()
  await db.delete(paintings).where(eq(paintings.id, id))
  revalidateAll()
}

export async function reorderPaintings(year: number, orderedIds: number[]) {
  await assertAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(paintings)
        .set({ sortOrder: index })
        .where(and(eq(paintings.id, id), eq(paintings.year, year))),
    ),
  )
  revalidateAll()
}

// ---------------------------------------------------------------------------
// CV + Contacts (singletons saved all at once)
// ---------------------------------------------------------------------------
export async function saveCv(intro: string, sections: CvSection[], links: CvLink[]) {
  await assertAdmin()
  await db
    .insert(cvContent)
    .values({ id: 1, intro, sections, links, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: cvContent.id,
      set: { intro, sections, links, updatedAt: new Date() },
    })
  revalidateAll()
}

export async function saveContacts(fields: ContactField[]) {
  await assertAdmin()
  await db
    .insert(contactsContent)
    .values({ id: 1, fields, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: contactsContent.id,
      set: { fields, updatedAt: new Date() },
    })
  revalidateAll()
}
