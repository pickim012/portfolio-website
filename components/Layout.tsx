'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarMenu, MobileMenu } from './Sidebar'
import { Navigator } from './Navigator'
import { Exhibition } from './Exhibition'
import { Painting } from './Painting'
import {
  artist,
  contacts,
  cv,
  exhibitions,
  paintingsByYear,
} from '@/data/site'
import { routeKey, type ExhibitionKind, type Route } from '@/lib/navigation'

function Home() {
  return (
    <section className="flex flex-col gap-8 py-4">
      <Image
        src={artist.homeImage.src || '/placeholder.svg'}
        alt={artist.homeImage.alt}
        width={1200}
        height={800}
        priority
        sizes="(max-width: 768px) 100vw, 800px"
        className="h-auto w-full"
      />
      <div className="flex flex-col gap-4">
        {artist.intro.map((line) => (
          <p key={line} className="text-lg leading-[1.35] text-foreground text-pretty">
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}

function Exhibitions({ kind }: { kind: ExhibitionKind }) {
  const shown = exhibitions.filter((exhibition) => exhibition.kind === kind)
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

function Paintings({ year }: { year: string }) {
  const works = paintingsByYear[year] ?? []
  return (
    <section className="flex flex-col gap-20 py-4">
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

function CV() {
  return (
    <section className="flex flex-col gap-8 py-4">
      <h1 className="font-display text-xl leading-[1.3] text-foreground">CV</h1>
      {cv.map((section) => (
        <div key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-base leading-[1.3] text-foreground">{section.heading}</h2>
          <ul className="flex flex-col gap-1">
            {section.entries.map((entry) => (
              <li key={entry} className="text-base leading-[1.3] text-foreground/75">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

function Contacts() {
  return (
    <section className="flex flex-col gap-6 py-4">
      {contacts.map((contact) => (
        <div key={contact.label} className="flex flex-col gap-1">
          <span className="text-sm text-secondary-ink">{contact.label}</span>
          <a
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : undefined}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-base text-foreground transition-colors duration-200 hover:text-hover-ink"
          >
            {contact.value}
          </a>
        </div>
      ))}
    </section>
  )
}

function Content({ route }: { route: Route }) {
  switch (route.view) {
    case 'home':
      return <Home />
    case 'exhibitions':
      return <Exhibitions kind={route.kind} />
    case 'paintings':
      return <Paintings year={route.year} />
    case 'cv':
      return <CV />
    case 'contacts':
      return <Contacts />
  }
}

export function Layout() {
  const [route, setRoute] = useState<Route>({ view: 'home' })

  const handleNavigate = (next: Route) => {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-only chrome */}
      <MobileMenu route={route} onNavigate={handleNavigate} />
      <Navigator
        route={route}
        className="pointer-events-none fixed right-5 top-7 z-30 md:hidden"
      />

      {/* True three-column grid: | Sidebar | Content | Navigator | */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-5 pb-32 pt-24 md:grid-cols-[200px_minmax(0,800px)_200px] md:justify-center md:gap-x-16 md:px-10 md:pt-[60px] lg:gap-x-24">
        {/* Column 1 — Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[60px]">
            <SidebarMenu route={route} onNavigate={handleNavigate} />
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
              <Content route={route} />
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
