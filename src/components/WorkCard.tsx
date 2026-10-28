import Image from 'next/image'
import Link from 'next/link'

import { formatPrice, mediaUrl } from '@/lib/payload'
import type { Work } from '@/payload-types'

export function WorkCard({ work }: { work: Work }) {
  const src = mediaUrl(work.cover, 'card')
  const category = typeof work.category === 'object' ? work.category : null

  return (
    <Link
      href={`/catalog/${work.slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-sand/40">
        {src && (
          <Image
            src={src}
            alt={typeof work.cover === 'object' ? work.cover.alt : work.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5">
        {category && <p className="text-xs font-semibold uppercase tracking-widest text-caramel">{category.title}</p>}
        <p className="mt-1 text-lg font-bold">{work.title}</p>
        {work.priceFrom ? <p className="mt-2 text-cocoa-light">от {formatPrice(work.priceFrom)}</p> : null}
      </div>
    </Link>
  )
}
