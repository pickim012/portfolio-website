import Image from 'next/image'
import type { Exhibition as ExhibitionType } from '@/data/site'

export function Exhibition({ exhibition }: { exhibition: ExhibitionType }) {
  return (
    <article className="flex flex-col items-center">
      <header className="mb-12 flex flex-col items-center gap-1 text-center leading-[1.25]">
        <h2 className="font-display text-2xl leading-[1.25] text-foreground text-balance">
          {exhibition.title}
        </h2>
        <p className="mt-4 text-base leading-[1.25] text-secondary-ink">{exhibition.date}</p>
        <p className="text-base leading-[1.25] text-secondary-ink">{exhibition.gallery}</p>
        <p className="text-base leading-[1.25] text-secondary-ink">{exhibition.address}</p>
      </header>

      <div className="flex w-full flex-col gap-10">
        {exhibition.images.map((image) => (
          <Image
            key={image.src}
            src={image.src || '/placeholder.svg'}
            alt={image.alt}
            width={1200}
            height={800}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 900px"
            className="h-auto w-full"
          />
        ))}
      </div>
    </article>
  )
}
