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

// Animate both height and opacity so expand and collapse are mirror images:
// Framer Motion tweens through the real measured content height in each
// direction (via AnimatePresence's exit), so siblings below shift smoothly
// instead of snapping into place.
const reveal = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
}

export function SidebarMenu({ route, onNavigate }: SidebarProps) {
  // Independent toggle state: each submenu opens/closes on its own,
  // and opening one never collapses the others.
  const [worksExpanded, setWorksExpanded] = useState(
    route.view === 'exhibitions' || route.view === 'paintings',
  )
  const [aboutExpanded, setAboutExpanded] = useState(
    route.view === 'cv' || route.view === 'contacts',
  )
  const [exhibitionsExpanded, setExhibitionsExpanded] = useState(route.view === 'exhibitions')
  const [paintingsExpanded, setPaintingsExpanded] = useState(route.view === 'paintings')

  // When the route changes elsewhere, ensure the relevant branch is open,
  // without collapsing any other submenu the user has already expanded.
  useEffect(() => {
    if (route.view === 'exhibitions') {
      setWorksExpanded(true)
      setExhibitionsExpanded(true)
    } else if (route.view === 'paintings') {
      setWorksExpanded(true)
      setPaintingsExpanded(true)
    } else if (route.view === 'cv' || route.view === 'contacts') {
      setAboutExpanded(true)
    }
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
            onClick={() => setWorksExpanded((v) => !v)}
          />
          <AnimatePresence initial={false}>
            {worksExpanded && (
              <motion.div {...reveal} className="flex flex-col gap-2 overflow-hidden">
                {/* Exhibitions → Solo / Group */}
                <MenuItem
                  label="Exhibitions"
                  indent={1}
                  onClick={() => setExhibitionsExpanded((v) => !v)}
                />
                <AnimatePresence initial={false}>
                  {exhibitionsExpanded && (
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
                  onClick={() => setPaintingsExpanded((v) => !v)}
                />
                <AnimatePresence initial={false}>
                  {paintingsExpanded && (
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
            onClick={() => setAboutExpanded((v) => !v)}
          />
          <AnimatePresence initial={false}>
            {aboutExpanded && (
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
