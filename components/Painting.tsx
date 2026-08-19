'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { PublicPainting } from '@/lib/content'

export function Painting({ painting }: { painting: PublicPainting }) {
  const figureRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [-5, 5])

  return (
    <motion.figure
      ref={figureRef}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex w-full flex-col gap-10">
        {painting.images.map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            style={{ y: imageY }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{
              duration: 0.7,
              delay: i * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={painting.title || 'Painting'}
              width={1200}
              height={1500}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 880px"
              className="h-auto w-full"
            />
          </motion.div>
        ))}
      </div>

      <motion.figcaption
        className="mt-6 flex flex-col items-center gap-0.5 text-center leading-[1.25]"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-serif text-sm italic text-foreground">{painting.title}</span>
        <span className="font-newsreader text-[10px] font-extralight leading-[1.2] text-secondary-ink">{painting.details}</span>
      </motion.figcaption>
    </motion.figure>
  )
}

