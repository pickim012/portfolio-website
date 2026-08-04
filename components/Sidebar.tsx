'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { artist, paintingYears } from '@/data/site'
import type { Route } from '@/lib/navigation'

type SidebarProps = {
  route: Route
  onNavigate: (route: Route) => void
}

function MenuItem({
  label,
  active = false,
  indent = 0,
  small = false,
  onClick,
}: {
  label: string
  active?: boolean
  indent?: number
  small?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{ paddingLeft: `${indent * 16}px` }}
      className={`block w-full text-left leading-[1.15] transition-colors duration-200 ${
        small ? 'text-sm' : 'text-base leading-[1.25]'
      } ${active ? 'text-foreground' : 'text-secondary-ink hover:text-hover-ink'}`}
    >
      {label}
    </button>
  )
}

const reveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

// Which top-level and Works submenus are expanded, derived from the route.
type TopOpen = 'works' | 'about' | null
type WorksOpen = 'exhibitions' | 'paintings' | null

function topFromRoute(route: Route): TopOpen {
  if (route.view === 'exhibitions' || route.view === 'paintings') return 'works'
  if (route.view === 'cv' || route.view === 'contacts') return 'about'
  return null
}

function worksFromRoute(route: Route): WorksOpen {
  if (route.view === 'exhibitions') return 'exhibitions'
  if (route.view === 'paintings') return 'paintings'
  return null
}

export function SidebarMenu({ route, onNavigate }: SidebarProps) {
  // Accordion state: only one branch open at a time on each level.
  const [topOpen, setTopOpen] = useState<TopOpen>(topFromRoute(route))
  const [worksOpen, setWorksOpen] = useState<WorksOpen>(worksFromRoute(route))

  // Keep the relevant branches open when the route changes elsewhere.
  useEffect(() => {
    const nextTop = topFromRoute(route)
    const nextWorks = worksFromRoute(route)
    if (nextTop) setTopOpen(nextTop)
    if (nextWorks) setWorksOpen(nextWorks)
  }, [route])

  return (
    <div className="flex flex-col gap-10">
      {/* Artist name → Home */}
      <button
        type="button"
        onClick={() => onNavigate({ view: 'home' })}
        className="text-left font-display text-2xl leading-[1.15] text-foreground transition-colors duration-200"
      >
        {artist.name.first}
        <br />
        {artist.name.last}
      </button>

      {/* Menu tree */}
      <div className="flex flex-col gap-5 text-base">
        {/* Works */}
        <div className="flex flex-col gap-2">
          <MenuItem
            label="Works"
            onClick={() => setTopOpen((v) => (v === 'works' ? null : 'works'))}
          />
          <AnimatePresence initial={false}>
            {topOpen === 'works' && (
              <motion.div {...reveal} className="flex flex-col gap-2 overflow-hidden">
                {/* Exhibitions → Solo / Group */}
                <MenuItem
                  label="Exhibitions"
                  indent={1}
                  onClick={() =>
                    setWorksOpen((v) => (v === 'exhibitions' ? null : 'exhibitions'))
                  }
                />
                <AnimatePresence initial={false}>
                  {worksOpen === 'exhibitions' && (
                    <motion.div {...reveal} className="flex flex-col gap-1.5 overflow-hidden">
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Paintings → years */}
                <MenuItem
                  label="Paintings"
                  indent={1}
                  onClick={() =>
                    setWorksOpen((v) => (v === 'paintings' ? null : 'paintings'))
                  }
                />
                <AnimatePresence initial={false}>
                  {worksOpen === 'paintings' && (
                    <motion.div {...reveal} className="flex flex-col gap-1.5 overflow-hidden">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* About */}
        <div className="flex flex-col gap-2">
          <MenuItem
            label="About"
            onClick={() => setTopOpen((v) => (v === 'about' ? null : 'about'))}
          />
          <AnimatePresence initial={false}>
            {topOpen === 'about' && (
              <motion.div {...reveal} className="flex flex-col gap-2 overflow-hidden">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function MobileMenu({ route, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile drawer whenever navigation completes.
  const handleNavigate = (next: Route) => {
    onNavigate(next)
    setMobileOpen(false)
  }

  return (
    <div className="md:hidden">
      {/* Mobile hamburger */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        className="fixed left-5 top-6 z-40 text-foreground"
      >
        <Menu className="h-6 w-6" strokeWidth={1} />
      </button>

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
              <SidebarMenu route={route} onNavigate={handleNavigate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
