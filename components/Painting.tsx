import Image from 'next/image'
import type { PublicPainting } from '@/lib/content'

export function Painting({ painting }: { painting: PublicPainting }) {
  return (
    <figure className="flex flex-col items-center">
      <div className="flex w-full flex-col gap-10">
        {painting.images.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src || '/placeholder.svg'}
            alt={painting.title || 'Painting'}
            width={1200}
            height={1500}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 880px"
            className="h-auto w-full"
          />
        ))}
      </div>

      <figcaption className="mt-6 flex flex-col items-center gap-0.5 text-center leading-[1.25]">
        <span className="font-serif text-sm italic text-foreground">{painting.title}</span>
        <span className="font-serif text-sm font-light text-secondary-ink">{painting.details}</span>
      </figcaption>
    </figure>
  )
}
