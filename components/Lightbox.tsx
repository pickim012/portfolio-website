'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

export type LightboxImage = { src: string; alt: string }

export function Lightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!image) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [image, onClose])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 md:p-16"
        >
          <div
            className="relative flex max-h-[85vh] max-w-[85vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={image.src || '/placeholder.svg'}
              alt={image.alt}
              width={1600}
              height={1200}
              className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
              sizes="85vw"
              priority
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
