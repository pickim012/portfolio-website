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
  onClick,
}: {
  label: string
  active?: boolean
  indent?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{ paddingLeft: `${indent * 16}px` }}
      className={`block w-full text-left text-base leading-[1.25] transition-colors duration-200 ${
        active ? 'text-foreground' : 'text-secondary-ink hover:text-hover-ink'
      }`}
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

export function SidebarMenu({ route, onNavigate }: SidebarProps) {
  const [worksOpen, setWorksOpen] = useState(
    route.view === 'exhibitions' || route.view === 'paintings',
  )
  const [paintingsOpen, setPaintingsOpen] = useState(route.view === 'paintings')
  const [aboutOpen, setAboutOpen] = useState(
    route.view === 'cv' || route.view === 'contacts',
  )

  // Keep the relevant branches open when the route changes elsewhere.
  useEffect(() => {
    if (route.view === 'exhibitions' || route.view === 'paintings') {
      setWorksOpen(true)
    }
    if (route.view === 'paintings') setPaintingsOpen(true)
    if (route.view === 'cv' || route.view === 'contacts') setAboutOpen(true)
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
          <MenuItem label="Works" onClick={() => setWorksOpen((v) => !v)} />
          <AnimatePresence initial={false}>
            {worksOpen && (
              <motion.div {...reveal} className="flex flex-col gap-2 overflow-hidden">
                <MenuItem
                  label="Exhibitions"
                  indent={1}
                  active={route.view === 'exhibitions'}
                  onClick={() => onNavigate({ view: 'exhibitions' })}
                />
                <MenuItem
                  label="Paintings"
                  indent={1}
                  onClick={() => setPaintingsOpen((v) => !v)}
                />
                <AnimatePresence initial={false}>
                  {paintingsOpen && (
                    <motion.div {...reveal} className="flex flex-col gap-2 overflow-hidden">
                      {paintingYears.map((year) => (
                        <MenuItem
                          key={year}
                          label={year}
                          indent={2}
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
          <MenuItem label="About" onClick={() => setAboutOpen((v) => !v)} />
          <AnimatePresence initial={false}>
            {aboutOpen && (
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
