'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Navigator } from './Navigator'
import { Exhibition } from './Exhibition'
import { Painting } from './Painting'
import { Lightbox, type LightboxImage } from './Lightbox'
import {
  artist,
  contacts,
  cv,
  exhibitions,
  paintingsByYear,
} from '@/data/site'
import { routeKey, type Route } from '@/lib/navigation'

function Home() {
  return (
    <section className="flex min-h-[60vh] flex-col justify-center py-20">
      <div className="flex max-w-xl flex-col gap-6">
        {artist.intro.map((line) => (
          <p key={line} className="text-lg leading-relaxed text-foreground text-pretty">
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}

function Exhibitions({
  onImageClick,
}: {
  onImageClick: (image: LightboxImage) => void
}) {
  return (
    <section className="flex flex-col gap-20 py-4">
      {exhibitions.map((exhibition) => (
        <Exhibition
          key={exhibition.id}
          exhibition={exhibition}
          onImageClick={onImageClick}
        />
      ))}
    </section>
  )
}

function Paintings({
  year,
  onImageClick,
}: {
  year: string
  onImageClick: (image: LightboxImage) => void
}) {
  const works = paintingsByYear[year] ?? []
  return (
    <section className="flex flex-col gap-20 py-4">
      {works.length === 0 ? (
        <p className="text-center text-base text-secondary-ink">
          No works for {year}.
        </p>
      ) : (
        works.map((painting) => (
          <Painting
            key={painting.id}
            painting={painting}
            onImageClick={onImageClick}
          />
        ))
      )}
    </section>
  )
}

function CV() {
  return (
    <section className="flex flex-col gap-10 py-4">
      {cv.map((entry) => (
        <div key={entry.year} className="flex flex-col gap-2">
          <h2 className="font-display text-xl text-foreground">{entry.year}</h2>
          <ul className="flex flex-col gap-1">
            {entry.items.map((item) => (
              <li key={item} className="text-base text-secondary-ink">
                {item}
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

function Content({
  route,
  onImageClick,
}: {
  route: Route
  onImageClick: (image: LightboxImage) => void
}) {
  switch (route.view) {
    case 'home':
      return <Home />
    case 'exhibitions':
      return <Exhibitions onImageClick={onImageClick} />
    case 'paintings':
      return <Paintings year={route.year} onImageClick={onImageClick} />
    case 'cv':
      return <CV />
    case 'contacts':
      return <Contacts />
  }
}

export function Layout() {
  const [route, setRoute] = useState<Route>({ view: 'home' })
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null)

  const handleNavigate = (next: Route) => {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar route={route} onNavigate={handleNavigate} />
      <Navigator route={route} />

      <main className="px-5 pb-32 pt-24 md:pl-[calc(220px+120px+40px)] md:pr-10 md:pt-[60px]">
        <div className="mx-auto w-full max-w-[900px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey(route)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Content route={route} onImageClick={setLightbox} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
