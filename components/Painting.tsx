'use client'

import Image from 'next/image'
import type { Painting as PaintingType } from '@/data/site'
import type { LightboxImage } from './Lightbox'

export function Painting({
  painting,
  onImageClick,
}: {
  painting: PaintingType
  onImageClick: (image: LightboxImage) => void
}) {
  return (
    <figure className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onImageClick(painting.image)}
        aria-label={`View larger: ${painting.title}`}
        className="block w-full cursor-zoom-in transition-opacity duration-200 hover:opacity-90"
      >
        <Image
          src={painting.image.src || '/placeholder.svg'}
          alt={painting.image.alt}
          width={1200}
          height={1500}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 900px"
          className="h-auto w-full"
        />
      </button>

      <figcaption className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-secondary-ink">
        <span className="italic">{painting.title}</span>
        <span>{painting.medium}</span>
        <span>{painting.size}</span>
        <span>{painting.date}</span>
      </figcaption>
    </figure>
  )
}
