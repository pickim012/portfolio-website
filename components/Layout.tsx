'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarMenu, MobileMenu } from './Sidebar'
import { Navigator } from './Navigator'
import { Exhibition } from './Exhibition'
import { Painting } from './Painting'
import type { SiteContent } from '@/lib/content'
import { routeKey, type ExhibitionKind, type Route } from '@/lib/navigation'

function Home({ home }: { home: SiteContent['home'] }) {
  const paragraphs = home.body.split(/\n{2,}/).filter((p) => p.trim() !== '')
  return (
    <section className="flex flex-col gap-8 py-4">
      {home.imageSrc ? (
        <Image
          src={home.imageSrc || '/placeholder.svg'}
          alt="Featured painting"
          width={1200}
          height={800}
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="h-auto w-full"
        />
      ) : null}
      <div className="flex flex-col gap-4">
        {paragraphs.map((line, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-lg leading-[1.35] text-foreground text-pretty"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}

function Exhibitions({
  kind,
  items,
}: {
  kind: ExhibitionKind
  items: SiteContent['exhibitions']
}) {
  const shown = items.filter((exhibition) => exhibition.kind === kind)
  return (
    <section className="flex flex-col gap-20 py-4">
      {shown.length === 0 ? (
        <p className="text-center text-base text-secondary-ink">
          No {kind} exhibitions yet.
        </p>
      ) : (
        shown.map((exhibition) => (
          <Exhibition key={exhibition.id} exhibition={exhibition} />
        ))
      )}
    </section>
  )
}

function Paintings({
  year,
  paintingsByYear,
}: {
  year: string
  paintingsByYear: SiteContent['paintingsByYear']
}) {
  const works = paintingsByYear[year] ?? []
  return (
    <section className="flex flex-col gap-24 py-4">
      {works.length === 0 ? (
        <p className="text-center text-base text-secondary-ink">
          No works for {year}.
        </p>
      ) : (
        works.map((painting) => <Painting key={painting.id} painting={painting} />)
      )}
    </section>
  )
}

function CV({ cv }: { cv: SiteContent['cv'] }) {
  return (
    <section className="flex flex-col gap-8 py-4">
      <h1 className="font-display text-xl leading-[1.3] text-foreground">CV</h1>
      {cv.map((section) => (
        <div key={section.id} className="flex flex-col gap-2">
          <h2 className="text-base leading-[1.3] text-foreground">{section.label}</h2>
          <p className="whitespace-pre-line text-base leading-[1.6] text-foreground/75">
            {section.content}
          </p>
        </div>
      ))}
    </section>
  )
}

function Contacts({ contacts }: { contacts: SiteContent['contacts'] }) {
  return (
    <section className="flex flex-col gap-6 py-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex flex-col gap-1">
          <span className="text-sm text-secondary-ink">{contact.label}</span>
          {contact.href ? (
            <a
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-base text-foreground transition-colors duration-200 hover:text-hover-ink"
            >
              {contact.value}
            </a>
          ) : (
            <p className="whitespace-pre-line text-base leading-[1.6] text-foreground">
              {contact.value}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

function Content({ route, content }: { route: Route; content: SiteContent }) {
  switch (route.view) {
    case 'home':
      return <Home home={content.home} />
    case 'exhibitions':
      return <Exhibitions kind={route.kind} items={content.exhibitions} />
    case 'paintings':
      return <Paintings year={route.year} paintingsByYear={content.paintingsByYear} />
    case 'cv':
      return <CV cv={content.cv} />
    case 'contacts':
      return <Contacts contacts={content.contacts} />
  }
}

export function Layout({ content }: { content: SiteContent }) {
  const [route, setRoute] = useState<Route>({ view: 'home' })

  const handleNavigate = (next: Route) => {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-only chrome */}
      <MobileMenu
        route={route}
        onNavigate={handleNavigate}
        paintingYears={content.paintingYears}
      />
      <Navigator
        route={route}
        className="pointer-events-none fixed right-5 top-7 z-30 md:hidden"
      />

      {/* True three-column grid: | Sidebar | Content | Navigator | */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-5 pb-32 pt-24 md:grid-cols-[200px_minmax(0,800px)_200px] md:justify-center md:gap-x-16 md:px-10 md:pt-[60px] lg:gap-x-24">
        {/* Column 1 — Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[60px]">
            <SidebarMenu
              route={route}
              onNavigate={handleNavigate}
              paintingYears={content.paintingYears}
            />
          </div>
        </aside>

        {/* Column 2 — Content */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey(route)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Content route={route} content={content} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Column 3 — Navigator (reserved, never overlaps content) */}
        <div className="hidden md:block">
          <div className="sticky top-[60px]">
            <Navigator route={route} />
          </div>
        </div>
      </div>
    </div>
  )
}
