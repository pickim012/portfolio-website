'use client'

import { Component, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarMenu, MobileMenu } from './Sidebar'
import { ARTIST_NAME } from '@/lib/site-config'
import { Navigator } from './Navigator'
import { Exhibition } from './Exhibition'
import { Painting } from './Painting'
import type { SiteContent } from '@/lib/content'
import { routeKey, type ExhibitionKind, type Route } from '@/lib/navigation'

function LandingScreen({ home, landingImage, onEnter }: { home: SiteContent['home']; landingImage?: { imageSrc: string; caption: string }; onEnter: () => void }) {
  const [isZoneHovered, setIsZoneHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const selectedPair = landingImage ?? { imageSrc: home.imageSrc, caption: '' }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background text-center">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`${selectedPair.imageSrc}-${selectedPair.caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
        <Image
        src={selectedPair.imageSrc || '/placeholder.svg'}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[rgba(255,255,255,0.25)] transition-opacity duration-300 ${isZoneHovered ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        type="button"
        onClick={onEnter}
        onMouseEnter={() => setIsZoneHovered(true)}
        onMouseLeave={() => setIsZoneHovered(false)}
        aria-label={`Enter ${ARTIST_NAME.first} ${ARTIST_NAME.last}'s website`}
        className="absolute left-1/2 top-1/2 flex h-[40vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-center"
      >
        <span
          className={`relative z-10 font-display text-2xl leading-[1.15] text-white transition-opacity duration-500 ease-out md:text-4xl ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: isVisible ? '180ms' : '0ms' }}
        >
          {ARTIST_NAME.first} {ARTIST_NAME.last}
        </span>
      </button>
      {selectedPair.caption.trim() && (
        <span className="absolute bottom-6 right-6 z-10 max-w-[min(28rem,calc(100%-3rem))] text-right text-xs leading-[1.45] text-white md:text-sm">
          {selectedPair.caption}
        </span>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Home({ home }: { home: SiteContent['home'] }) {
  const paragraphs = home.body.split(/\n{2,}/).filter((p) => p.trim() !== '')
  return (
    <section className="flex flex-col gap-3 py-4">
      <figure className="flex w-fit max-w-full flex-col gap-3">
        {home.imageSrc ? (
          <Image
src={home.imageSrc || '/placeholder.svg'}
            alt="Featured painting"
            width={1200}
            height={800}
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="h-auto max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain object-left-top"
          />
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
  onImageError,
}: {
  kind: ExhibitionKind
  items: SiteContent['exhibitions']
  onImageError?: (message: string) => void
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
          <Exhibition key={exhibition.id} exhibition={exhibition} onImageError={onImageError} />
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
        <p className="-mt-3 whitespace-pre-line pl-3 font-serif text-lg not-italic leading-[1.35] text-foreground/75">
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

class GroupDebugBoundary extends Component<
  { children: React.ReactNode; onError: (message: string) => void },
  { error: string | null; stack: string | null }
> {
  state = { error: null, stack: null }

  static getDerivedStateFromError(error: unknown) {
    return {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack ?? null : null,
    }
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error instanceof Error ? error.stack || error.message : String(error))
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="rounded border-2 border-red-600 bg-red-50 p-4 text-left text-red-950">
        <p className="font-bold">Group debug error</p>
        <p className="mt-2 font-mono text-sm">{this.state.error}</p>
        {this.state.stack && <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">{this.state.stack}</pre>}
      </div>
    )
  }
}

function Content({ route, content, onImageError }: { route: Route; content: SiteContent; onImageError?: (message: string) => void }) {
  switch (route.view) {
    case 'home':
      return null
    case 'exhibitions':
      return <Exhibitions kind={route.kind} items={content.exhibitions} onImageError={onImageError} />
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

export function Layout({ content, landingImage }: { content: SiteContent; landingImage?: { imageSrc: string; caption: string } }) {
  const [route, setRoute] = useState<Route>({ view: 'home' })
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [homeLeaving, setHomeLeaving] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [groupDebugError, setGroupDebugError] = useState<string | null>(null)
  const homeLeaveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (route.view !== 'exhibitions' || route.kind !== 'group') return
    const report = (value: unknown) => {
      const message = value instanceof Error ? value.stack || value.message : String(value)
      setGroupDebugError(message)
    }
    const handleError = (event: ErrorEvent) => report(event.error || event.message)
    const handleRejection = (event: PromiseRejectionEvent) => report(event.reason)
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [route])

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 320)
    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
    return () => window.removeEventListener('scroll', updateBackToTop)
  }, [])

  useEffect(() => {
    const returnToLanding = () => {
      if (homeLeaveTimer.current !== null) window.clearTimeout(homeLeaveTimer.current)
      setHomeLeaving(true)
      homeLeaveTimer.current = window.setTimeout(() => {
        setRoute({ view: 'home' })
        setHasEnteredSite(false)
        setHomeLeaving(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }, 350)
    }
    window.addEventListener('site:return-landing', returnToLanding)
    return () => {
      window.removeEventListener('site:return-landing', returnToLanding)
      if (homeLeaveTimer.current !== null) window.clearTimeout(homeLeaveTimer.current)
    }
  }, [])

  const handleNavigate = (next: Route) => {
    try {
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
    } catch (error) {
      if (route.view === 'exhibitions' && route.kind === 'group') {
        setGroupDebugError(error instanceof Error ? error.stack || error.message : String(error))
      }
    }
  }

  if (!hasEnteredSite) {
    return (
      <LandingScreen
        home={content.home}
        landingImage={landingImage}
        onEnter={() => {
          const topmostYear = content.paintingYears[0]
          if (topmostYear) {
            setRoute({ view: 'paintings', year: topmostYear })
          }
          setHasEnteredSite(true)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-6 right-6 z-40 text-lg leading-none text-foreground/40 transition-[opacity,color] duration-300 hover:text-hover-ink md:right-[clamp(1.5rem,calc((100vw-1440px)/2+11.25rem),16rem)] ${showBackToTop ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        ↑
      </button>

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
      <div className={`flex w-full flex-1 flex-col mx-auto max-w-[1440px] grid-cols-1 px-5 pb-32 pt-24 md:grid md:px-10 md:pt-[60px] ${route.view === 'home' ? 'md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-10' : 'md:grid-cols-[170px_minmax(0,1fr)_140px] md:justify-center md:gap-x-10 lg:gap-x-16'}`}>
        {/* Column 1 — Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[60px]">
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarMenu
                route={route}
                onNavigate={handleNavigate}
                paintingYears={content.paintingYears}
                hasTexts={content.textsLinks.length > 0}
                isHome={route.view === 'home'}
              />
            </motion.div>
          </div>
        </aside>

        {/* Column 2 — Content */}
        <main className="w-full">
          {route.view === 'exhibitions' && route.kind === 'group' && groupDebugError && (
            <div role="alert" className="mb-4 rounded border border-red-500 bg-red-50 p-4 font-mono text-xs leading-relaxed text-red-900">
              Group debug error: {groupDebugError}
            </div>
          )}
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
              {route.view === 'exhibitions' && route.kind === 'group' ? (
                <GroupDebugBoundary onError={setGroupDebugError}>
                  <Content route={route} content={content} onImageError={setGroupDebugError} />
                </GroupDebugBoundary>
              ) : (
                <Content route={route} content={content} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Column 3 — Navigator (reserved on non-home pages only) */}
        {route.view !== 'home' && (
          <div className="hidden md:block">
            <div className="fixed right-[2.5rem] top-[60px] z-30 xl:right-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
              <Navigator route={route} />
            </div>
          </div>
        )}
      </div>
      <footer className="mt-auto px-5 pb-8 text-center font-serif text-xs leading-relaxed tracking-wide text-foreground/40 md:px-10">
        © 2026 Kim Yeadam. All rights reserved. No part of this website may be reproduced without permission.
      </footer>
    </div>
  )
}
