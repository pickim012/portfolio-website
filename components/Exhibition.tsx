'use client'

import Image from 'next/image'
import type { Exhibition as ExhibitionType } from '@/data/site'
import type { LightboxImage } from './Lightbox'

export function Exhibition({
  exhibition,
  onImageClick,
}: {
  exhibition: ExhibitionType
  onImageClick: (image: LightboxImage) => void
}) {
  return (
    <article className="flex flex-col items-center">
      <header className="mb-12 flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl leading-snug text-foreground text-balance">
          {exhibition.title}
        </h2>
        <p className="text-base text-secondary-ink">({exhibition.type})</p>
        <p className="mt-4 text-base text-secondary-ink">{exhibition.date}</p>
        <p className="text-base text-secondary-ink">{exhibition.gallery}</p>
        <p className="text-base text-secondary-ink">{exhibition.address}</p>
      </header>

      <div className="flex w-full flex-col gap-10">
        {exhibition.images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => onImageClick(image)}
            aria-label={`View larger: ${image.alt}`}
            className="block w-full cursor-zoom-in transition-opacity duration-200 hover:opacity-90"
          >
            <Image
              src={image.src || '/placeholder.svg'}
              alt={image.alt}
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 900px"
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>
    </article>
  )
}
