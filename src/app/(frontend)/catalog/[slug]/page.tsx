import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { LeadForm } from '@/components/LeadForm'
import { formatPrice, getPayloadClient, mediaUrl } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

const MECHANISMS: Record<string, string> = {
  eurobook: 'Еврокнижка',
  dolphin: 'Дельфин',
  accordion: 'Аккордеон',
  pantograph: 'Пантограф',
  french: 'Французская раскладушка',
  recliner: 'Реклайнер',
  lift: 'Подъёмный',
}

const getWork = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'works',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await getWork((await params).slug)
  if (!work) return {}
  const image = mediaUrl(work.cover, 'card')
  return {
    title: work.title,
    description: work.excerpt || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function WorkPage({ params }: Props) {
  const work = await getWork((await params).slug)
  if (!work) notFound()

  const category = typeof work.category === 'object' ? work.category : null
  const images = [work.cover, ...(work.gallery ?? [])].filter((m) => typeof m === 'object' && m !== null)
  const materials = (work.materials ?? []).filter((m) => typeof m === 'object')

  return (
    <div className="container-site py-12">
      <nav className="text-sm text-cocoa-light">
        <Link href="/catalog" className="hover:underline">Каталог</Link>
        {category && (
          <>
            {' / '}
            <Link href={`/catalog?category=${category.slug}`} className="hover:underline">{category.title}</Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="grid gap-4">
          {images.map((img, i) => {
            const src = mediaUrl(img, 'hero')
            return src && typeof img === 'object' ? (
              <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand/40">
                <Image src={src} alt={img.alt} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
              </div>
            ) : null
          })}
        </div>

        <div>
          <h1 className="text-3xl font-serif sm:text-4xl">{work.title}</h1>
          {work.priceFrom ? (
            <p className="mt-4 text-2xl font-bold text-caramel">от {formatPrice(work.priceFrom)}</p>
          ) : null}

          <dl className="mt-6 grid gap-3 text-sm">
            {work.dimensions && (
              <div><dt className="font-semibold">Размеры</dt><dd>{work.dimensions}</dd></div>
            )}
            {work.leadTime && (
              <div><dt className="font-semibold">Срок изготовления</dt><dd>{work.leadTime}</dd></div>
            )}
            {work.mechanism && work.mechanism !== 'none' && (
              <div><dt className="font-semibold">Механизм</dt><dd>{MECHANISMS[work.mechanism]}</dd></div>
            )}
            {materials.length > 0 && (
              <div>
                <dt className="font-semibold">Ткани и материалы</dt>
                <dd>{materials.map((m) => (typeof m === 'object' ? m.title : '')).join(', ')}</dd>
              </div>
            )}
          </dl>

          {work.excerpt && <p className="mt-6">{work.excerpt}</p>}
          {work.description && (
            <div className="mt-6 space-y-4 leading-relaxed">
              <RichText data={work.description} />
            </div>
          )}

          <div className="mt-10">
            <LeadForm workId={work.id} title="Хочу такую же" />
          </div>
        </div>
      </div>
    </div>
  )
}
