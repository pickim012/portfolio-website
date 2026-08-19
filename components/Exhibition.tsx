import Image from 'next/image'
import type { PublicExhibition } from '@/lib/content'

export function Exhibition({ exhibition }: { exhibition: PublicExhibition }) {
  return (
    <article className="flex flex-col items-center">
      <header className="mb-12 flex flex-col items-center gap-1 text-center leading-[1.25]">
        <h2 className="font-display text-2xl italic leading-[1.25] text-foreground text-balance">
          {exhibition.title}
        </h2>
        <p className="mt-4 font-newsreader text-sm font-extralight leading-[1.15] text-hover-ink">{exhibition.date}</p>
        <p className="font-newsreader text-sm font-extralight leading-[1.15] text-hover-ink">{exhibition.gallery}</p>
        <p className="font-newsreader text-sm font-extralight leading-[1.15] text-hover-ink">{exhibition.address}</p>
      </header>

      <div className="flex w-full flex-col gap-10">
        {exhibition.images.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src || '/placeholder.svg'}
            alt={exhibition.title || 'Exhibition'}
            width={1200}
            height={800}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 900px"
            className="h-auto w-full"
          />
        ))}
      </div>

      {exhibition.about.trim() !== '' && (
        <p className="mt-12 w-full whitespace-pre-line pl-2 font-newsreader text-sm font-extralight leading-relaxed text-hover-ink">
          {exhibition.about}
        </p>
      )}

      {exhibition.links.length > 0 && (
        <div className="mt-8 w-full pl-2 text-left font-newsreader text-sm font-extralight leading-[1.45] text-hover-ink">
          {exhibition.links.map((link, index) => (
            <span key={link.id}>
              <a
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="underline underline-offset-4 transition-colors duration-200 hover:text-hover-ink"
              >
                {link.title}
              </a>
              {index < exhibition.links.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
