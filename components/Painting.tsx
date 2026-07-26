import Image from 'next/image'
import type { Painting as PaintingType } from '@/data/site'

export function Painting({ painting }: { painting: PaintingType }) {
  return (
    <figure className="flex flex-col items-center">
      <Image
        src={painting.image.src || '/placeholder.svg'}
        alt={painting.image.alt}
        width={1200}
        height={1500}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 880px"
        className="h-auto w-full"
      />

      <figcaption className="mt-6 flex flex-col items-center gap-0.5 text-center leading-[1.25]">
        <span className="font-serif text-sm italic text-foreground">{painting.title}</span>
        <span className="font-serif text-sm font-light text-secondary-ink">{painting.details}</span>
      </figcaption>
    </figure>
  )
}
