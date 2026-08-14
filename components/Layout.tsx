'use client'

import { useEffect, useRef, useState } from 'react'
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
    <section className="flex flex-col gap-3 py-4">
      <figure className="flex w-fit max-w-full flex-col gap-3">
        {home.imageSrc ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('site:toggle-home-menu'))}
            aria-label="Open menu"
            className="block w-fit max-w-full cursor-pointer text-left"
          >
            <Image
              src={home.imageSrc || '/placeholder.svg'}
              alt="Featured painting"
              width={1200}
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-auto max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain object-left-top transition-opacity duration-200 hover:opacity-90"
            />
          </button>
        ) : null}
        <figcaption className="flex w-full flex-col items-end gap-4 text-right">
        {paragraphs.map((line, i) => (
          <p
            key={i}
            className="whitespace-pre-line text-sm leading-[1.45] text-secondary-ink text-pretty"
          >
            {line}
          </p>
        ))}
        </figcaption>
      </figure>
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
    <section className="flex flex-col gap-40 py-4">
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

function Texts({ links }: { links: SiteContent['textsLinks'] }) {
  return (
    <section className="flex flex-col gap-8 py-4">
      <h1 className="font-display text-xl leading-[1.2] text-foreground">Texts</h1>
      <div className="flex flex-col gap-1 pl-2 text-base leading-[1.45] text-foreground/75">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="underline underline-offset-4 transition-colors duration-200 hover:text-hover-ink"
          >
            {link.title}
          </a>
        ))}
      </div>
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

function CV({
  cvIntro,
  cv,
  cvLinks,
}: {
  cvIntro: SiteContent['cvIntro']
  cv: SiteContent['cv']
  cvLinks: SiteContent['cvLinks']
}) {
  return (
    <section className="flex flex-col gap-8 py-4">
      <h1 className="font-display text-xl leading-[1.2] text-foreground">CV</h1>
      {cvIntro.trim() && (
        <p className="-mt-3 whitespace-pre-line pl-2 font-serif text-lg not-italic leading-[1.35] text-foreground/75">
          {cvIntro}
        </p>
      )}
      {cv.map((section) => (
        <div key={section.id} className="flex flex-col gap-1">
          <h2 className="text-base leading-[1.2] text-secondary-ink">{section.label === 'Group Exhibitions' ? 'Selected Group Exhibitions' : section.label}</h2>
          <p className="whitespace-pre-line pl-2 text-base leading-[1.45] text-foreground/75">
            {section.content}
          </p>
        </div>
      ))}
      {cvLinks.length > 0 && (
        <div className="flex flex-col gap-1">
          <h2 className="text-base leading-[1.2] text-secondary-ink">Links</h2>
          <div className="flex flex-col gap-1 pl-2 text-base leading-[1.45] text-foreground/75">
            {cvLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="underline underline-offset-4 transition-colors duration-200 hover:text-hover-ink"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Contacts({ contacts }: { contacts: SiteContent['contacts'] }) {
  return (
    <section className="flex flex-col gap-6 py-4">
      <h1 className="font-display text-xl leading-[1.3] text-foreground">Contacts</h1>
      {contacts.map((contact) => (
        <div key={contact.id} className="flex flex-col gap-1">
          <span className="text-base leading-[1.2] text-secondary-ink">{contact.label}</span>
          {contact.href ? (
            <a
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="pl-2 text-base leading-[1.6] text-foreground/75 transition-colors duration-200 hover:text-hover-ink"
            >
              {contact.value}
            </a>
          ) : (
            <p className="whitespace-pre-line pl-2 text-base leading-[1.6] text-foreground/75">
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
    case 'texts':
      return <Texts links={content.textsLinks} />
    case 'cv':
      return <CV cvIntro={content.cvIntro} cv={content.cv} cvLinks={content.cvLinks} />
    case 'contacts':
      return <Contacts contacts={content.contacts} />
  }
}

export function Layout({ content }: { content: SiteContent }) {
  const [route, setRoute] = useState<Route>({ view: 'home' })
  const [homeLeaving, setHomeLeaving] = useState(false)
  const homeLeaveTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (homeLeaveTimer.current !== null) window.clearTimeout(homeLeaveTimer.current)
    }
  }, [])

  const handleNavigate = (next: Route) => {
    if (routeKey(next) === routeKey(route) || homeLeaving) return

    // Home uses a wider grid than interior pages. Fade it out before changing
    // the grid, so the outgoing image never visibly reflows into a smaller size.
    if (route.view === 'home') {
      setHomeLeaving(true)
      homeLeaveTimer.current = window.setTimeout(() => {
        setRoute(next)
        setHomeLeaving(false)
      }, 350)
      return
    }

    // Keep other outgoing pages at their current position; scroll resets after exit.
    setRoute(next)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-only chrome */}
      <MobileMenu
        route={route}
        onNavigate={handleNavigate}
        paintingYears={content.paintingYears}
        hasTexts={content.textsLinks.length > 0}
        isHome={route.view === 'home'}
      />
      {route.view !== 'home' && (
        <Navigator
          route={route}
          className="pointer-events-none fixed right-5 top-7 z-30 md:hidden"
        />
      )}

      {/* True three-column grid: | Sidebar | Content | Navigator | */}
      <div className={`mx-auto grid max-w-[1440px] grid-cols-1 px-5 pb-32 pt-24 md:px-10 md:pt-[60px] ${route.view === 'home' ? 'md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-10' : 'md:grid-cols-[170px_minmax(0,1fr)_140px] md:justify-center md:gap-x-10 lg:gap-x-16'}`}>
        {/* Column 1 — Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[60px]">
            <SidebarMenu
              route={route}
              onNavigate={handleNavigate}
              paintingYears={content.paintingYears}
              hasTexts={content.textsLinks.length > 0}
              isHome={route.view === 'home'}
            />
          </div>
        </aside>

        {/* Column 2 — Content */}
        <main className="w-full">
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              window.dispatchEvent(new CustomEvent('site:navigate'))
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            }}
          >
            <motion.div
              key={routeKey(route)}
              initial={{ opacity: 0 }}
              animate={{ opacity: homeLeaving ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Content route={route} content={content} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Column 3 — Navigator (reserved on non-home pages only) */}
        {route.view !== 'home' && (
          <div className="hidden md:block">
            <div className="sticky top-[60px]">
              <Navigator route={route} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
