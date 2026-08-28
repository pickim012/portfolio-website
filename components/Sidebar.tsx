'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ARTIST_NAME } from '@/lib/site-config'
import type { Route } from '@/lib/navigation'

type SidebarProps = {
  route: Route
  onNavigate: (route: Route) => void
  paintingYears: string[]
  hasTexts?: boolean
  isHome?: boolean
  showIdentity?: boolean
  showHomeItem?: boolean
}

// Shared easing/duration used by both the height collapse and the sibling
// position (layout) animation, so a block sliding up to fill freed space
// settles with the exact same motion as the collapse itself.
const EASE = [0.4, 0, 0.2, 1] as const
const DURATION = 0.25
const layoutTransition = { layout: { duration: DURATION, ease: EASE } }

function MenuItem({
  label,
  active = false,
  indent = 0,
  small = false,
  onClick,
  interactive = true,
  muted = false,
}: {
  label: string
  active?: boolean
  indent?: number
  small?: boolean
  onClick?: () => void
  interactive?: boolean
  muted?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-current={active ? 'page' : undefined}
      style={{ paddingLeft: `${indent * 16}px` }}
      className={`block w-full text-left leading-[1.15] ${
        small ? 'text-sm' : 'text-base leading-[1.25]'
      } ${active ? 'text-foreground' : muted || !interactive ? 'text-secondary-ink' : 'text-secondary-ink transition-colors duration-200 hover:text-hover-ink'}`}
    >
      {label}
    </button>
  )
}

// Animate both height and opacity so expand and collapse are mirror images.
// The spacing above the revealed items lives INSIDE the animated element (as
// top padding on `innerClassName`) rather than as a parent flex `gap`. A
// parent gap would stay reserved for this child until it unmounts, then
// collapse instantly — the "snap" at the very end of a collapse. Keeping the
// spacing inside the measured height means it eases away with everything else.
function Collapse({
  open,
  innerClassName,
  children,
}: {
  open: boolean
  innerClassName: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DURATION, ease: EASE }}
          className="overflow-hidden"
        >
          <div className={innerClassName}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SidebarMenu({
  route,
  onNavigate,
  paintingYears,
  hasTexts = false,
  isHome = false,
  showIdentity = true,
  showHomeItem = false,
}: SidebarProps) {
  const [homeMenuExpanded, setHomeMenuExpanded] = useState(true)

  useEffect(() => {
    setHomeMenuExpanded(true)
  }, [isHome])

  // Independent toggle state: each submenu opens/closes on its own,
  // and opening one never collapses the others.
  const [aboutExpanded, setAboutExpanded] = useState(
    route.view === 'cv' || route.view === 'contacts',
  )
  const [exhibitionsExpanded, setExhibitionsExpanded] = useState(false)
  const [paintingsExpanded, setPaintingsExpanded] = useState(false)

  // When the route changes elsewhere, ensure the relevant branch is open,
  // without collapsing any other submenu the user has already expanded.
  useEffect(() => {
    if (route.view === 'cv' || route.view === 'contacts') {
      setAboutExpanded(true)
    }
  }, [route])

  return (
    <div className="flex flex-col gap-10">
      {/* Artist name → Home */}
      {showIdentity && (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('site:return-landing'))}
          className="text-left font-display text-2xl leading-[1.15] text-foreground transition-colors duration-200 hover:text-secondary-ink"
        >
          {ARTIST_NAME.first}
          <br />
          {ARTIST_NAME.last}
        </button>
      )}

      {/* Menu tree. Each collapsible region is the LAST child of a no-gap
          flex column, so there is never a reserved parent gap left to snap
          when it unmounts. Vertical spacing between sibling *blocks* uses gap
          on their static wrappers, which stay mounted and never snap. */}
      <Collapse open={!isHome || homeMenuExpanded} innerClassName="flex flex-col gap-6 text-base">
        {showHomeItem && (
          <MenuItem label="Home" active={false} onClick={() => window.dispatchEvent(new CustomEvent('site:return-landing'))} />
        )}
        {/* Works */}
        <motion.div layout="position" transition={layoutTransition} className="flex flex-col">
          <MenuItem label="Works" interactive={false} muted />
          <div className="flex flex-col gap-2 pt-2">
            {/* Exhibitions → Solo / Group */}
            <motion.div layout="position" transition={layoutTransition} className="flex flex-col">
              <MenuItem
                label="Exhibitions"
                indent={1}
                onClick={() => setExhibitionsExpanded((v) => !v)}
              />
              <Collapse
                open={exhibitionsExpanded}
                innerClassName="flex flex-col gap-1.5 pt-1.5"
              >
                <MenuItem
                  label="Solo"
                  indent={2}
                  small
                  active={route.view === 'exhibitions' && route.kind === 'solo'}
                  onClick={() => onNavigate({ view: 'exhibitions', kind: 'solo' })}
                />
                <MenuItem
                  label="Group"
                  indent={2}
                  small
                  active={route.view === 'exhibitions' && route.kind === 'group'}
                  onClick={() => onNavigate({ view: 'exhibitions', kind: 'group' })}
                />
              </Collapse>
            </motion.div>

            {/* Paintings → years */}
            <motion.div layout="position" transition={layoutTransition} className="flex flex-col">
              <MenuItem
                label="Paintings"
                indent={1}
                onClick={() => setPaintingsExpanded((v) => !v)}
              />
              <Collapse
                open={paintingsExpanded}
                innerClassName="flex flex-col gap-1.5 pt-1.5"
              >
                {paintingYears.map((year) => (
                  <MenuItem
                    key={year}
                    label={year}
                    indent={2}
                    small
                    active={route.view === 'paintings' && route.year === year}
                    onClick={() => onNavigate({ view: 'paintings', year })}
                  />
                ))}
              </Collapse>
            </motion.div>
            {hasTexts && (
              <MenuItem
                label="Texts"
                indent={1}
                active={route.view === 'texts'}
                onClick={() => onNavigate({ view: 'texts' })}
              />
            )}
          </div>
        </motion.div>

        {/* About */}
        <motion.div layout="position" transition={layoutTransition} className="flex flex-col">
          <MenuItem label="About" onClick={() => setAboutExpanded((v) => !v)} />
          <Collapse open={aboutExpanded} innerClassName="flex flex-col gap-2 pt-2">
            <MenuItem
              label="CV"
              indent={1}
              active={route.view === 'cv'}
              onClick={() => onNavigate({ view: 'cv' })}
            />
            <MenuItem
              label="Contacts"
              indent={1}
              active={route.view === 'contacts'}
              onClick={() => onNavigate({ view: 'contacts' })}
            />
          </Collapse>
        </motion.div>
      </Collapse>
    </div>
  )
}

export function MobileMenu({ route, onNavigate, paintingYears, hasTexts = false, isHome = false }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const closeAfterNavigation = () => setMobileOpen(false)
    window.addEventListener('site:navigate', closeAfterNavigation)
    return () => window.removeEventListener('site:navigate', closeAfterNavigation)
  }, [])

  const handleNavigate = (next: Route) => {
    onNavigate(next)
  }

  return (
    <div className="md:hidden">
      <header className="fixed left-5 top-6 z-40">
        <div className="font-display text-2xl leading-[1.15] text-foreground">
          <button
            type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('site:return-landing'))
            setMobileOpen(false)
          }}
          aria-label="Go to landing page"
            className="block text-left"
          >
            {ARTIST_NAME.first}
          </button>
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigate({ view: 'home' })}
              className="text-left"
            >
              {ARTIST_NAME.last}
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="text-secondary-ink"
            >
              <Menu className="h-4 w-4" strokeWidth={1} />
            </button>
          </span>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background px-6 py-6"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-5 top-6 text-foreground"
            >
              <X className="h-6 w-6" strokeWidth={1} />
            </button>
            <div className="mt-12">
              <SidebarMenu
                route={route}
                onNavigate={handleNavigate}
                paintingYears={paintingYears}
                hasTexts={hasTexts}
                isHome={false}
                showIdentity={false}
                showHomeItem
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
