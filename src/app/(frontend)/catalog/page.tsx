import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'

import { WorkCard } from '@/components/WorkCard'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Каталог работ' }

type Props = { searchParams: Promise<{ category?: string }> }

export default async function CatalogPage({ searchParams }: Props) {
  const { category: categorySlug } = await searchParams
  const payload = await getPayloadClient()

  const categories = await payload.find({ collection: 'categories', limit: 50, sort: 'order' })
  const active = categories.docs.find((c) => c.slug === categorySlug)

  const where: Where = { _status: { equals: 'published' } }
  if (active) where.category = { equals: active.id }

  const works = await payload.find({ collection: 'works', where, limit: 60, sort: '-createdAt' })

  const pill = (isActive: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-cocoa text-cream' : 'bg-white text-cocoa hover:bg-sand/50'
    }`

  return (
    <div className="container-site py-12">
      <h1 className="text-4xl font-serif">{active ? active.title : 'Каталог работ'}</h1>
      {active?.description && <p className="mt-3 max-w-2xl text-cocoa-light">{active.description}</p>}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/catalog" className={pill(!active)}>
          Все
        </Link>
        {categories.docs.map((c) => (
          <Link key={c.id} href={`/catalog?category=${c.slug}`} className={pill(c.id === active?.id)}>
            {c.title}
          </Link>
        ))}
      </div>

      {works.docs.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.docs.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-cocoa-light">Работы в этом разделе скоро появятся.</p>
      )}
    </div>
  )
}
