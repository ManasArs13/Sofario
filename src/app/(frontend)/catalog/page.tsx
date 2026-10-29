import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { cache } from 'react'

import { WorkCard } from '@/components/WorkCard'
import { withCity } from '@/lib/city'
import { getPayloadClient, getSiteSettings } from '@/lib/payload'
import type { Category } from '@/payload-types'

type Props = { searchParams: Promise<{ category?: string }> }

const getCategories = cache(async () => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'categories', limit: 50, sort: 'order' })).docs
})

// H1 категории: своё SEO-название из админки или «Название + город»
const categoryHeading = (c: Category, cityIn?: string | null) =>
  withCity(c.seoTitle || `${c.title} {город}`, cityIn)

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category: slug } = await searchParams
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()])
  const active = categories.find((c) => c.slug === slug)
  if (!active) return { title: 'Каталог' }
  return {
    // Город уже в заголовке категории — не повторяем его хвостом из шаблона
    title: { absolute: `${categoryHeading(active, settings.cityIn)} — SOFARIO` },
    description: withCity(active.description, settings.cityIn) || undefined,
  }
}

export default async function CatalogPage({ searchParams }: Props) {
  const { category: categorySlug } = await searchParams
  const payload = await getPayloadClient()
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()])
  const active = categories.find((c) => c.slug === categorySlug)

  const where: Where = { _status: { equals: 'published' } }
  if (active) where.category = { equals: active.id }

  const works = await payload.find({ collection: 'works', where, limit: 60, sort: '-createdAt' })

  const pill = (isActive: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-cocoa text-cream' : 'bg-white text-cocoa hover:bg-sand/50'
    }`

  return (
    <div className="container-site py-12">
      <h1 className="text-4xl font-serif">
        {active ? categoryHeading(active, settings.cityIn) : withCity('Каталог мягкой мебели {город}', settings.cityIn)}
      </h1>
      {active?.description && (
        <p className="mt-3 max-w-2xl text-cocoa-light">{withCity(active.description, settings.cityIn)}</p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/catalog" className={pill(!active)}>
          Все
        </Link>
        {categories.map((c) => (
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
