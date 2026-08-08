'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      duration: 1.05,
      lerp: 0.085,
      syncTouch: false,
    })

    const resetScroll = () => {
      lenis.scrollTo(0, { immediate: true, force: true })
    }
    window.addEventListener('site:navigate', resetScroll)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(raf)
    }
    frame = window.requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('site:navigate', resetScroll)
      window.cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
