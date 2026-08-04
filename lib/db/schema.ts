import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

// Home page: single row (id = 1).
export const homeContent = pgTable('home_content', {
  id: integer('id').primaryKey().default(1),
  imageUrl: text('image_url').notNull().default(''),
  body: text('body').notNull().default(''),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Exhibitions: relational — per-row publish, ordering, grouping by kind.
export const exhibitions = pgTable('exhibitions', {
  id: serial('id').primaryKey(),
  kind: text('kind').notNull(), // 'solo' | 'group'
  title: text('title').notNull().default(''),
  dateText: text('date_text').notNull().default(''),
  gallery: text('gallery').notNull().default(''),
  address: text('address').notNull().default(''),
  images: jsonb('images').notNull().default([]), // string[] of image URLs
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0), // ascending; smallest = top
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Paintings: relational — grouped by year, ordered within a year.
export const paintings = pgTable('paintings', {
  id: serial('id').primaryKey(),
  year: integer('year').notNull(),
  dateText: text('date_text').notNull().default(''),
  title: text('title').notNull().default(''),
  details: text('details').notNull().default(''),
  images: jsonb('images').notNull().default([]), // string[] of image URLs
  sortOrder: integer('sort_order').notNull().default(0), // ascending; smallest = top
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// CV: single row holding an ordered array of sections (fixed + custom) as JSON.
export const cvContent = pgTable('cv_content', {
  id: integer('id').primaryKey().default(1),
  sections: jsonb('sections').notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Contacts: single row holding an ordered array of fields (fixed + custom) as JSON.
export const contactsContent = pgTable('contacts_content', {
  id: integer('id').primaryKey().default(1),
  fields: jsonb('fields').notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
