import Image from 'next/image'
import Link from 'next/link'

import { LeadForm } from '@/components/LeadForm'
import { WorkCard } from '@/components/WorkCard'
import { getPayloadClient, mediaUrl } from '@/lib/payload'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, categories, featured, reviews] = await Promise.all([
    payload.findGlobal({ slug: 'home-page' }),
    payload.find({ collection: 'categories', limit: 12, sort: 'order' }),
    payload.find({
      collection: 'works',
      where: { featured: { equals: true }, _status: { equals: 'published' } },
      limit: 6,
      sort: '-createdAt',
    }),
    payload.find({ collection: 'reviews', where: { approved: { equals: true } }, limit: 6, sort: '-createdAt' }),
  ])

  const heroImage = mediaUrl(home.hero?.image, 'hero')

  return (
    <>
      <section className="relative overflow-hidden bg-cocoa text-cream">
        {heroImage && (
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        )}
        <div className="container-site relative py-24 sm:py-32">
          <h1 className="max-w-3xl text-4xl leading-tight font-serif sm:text-6xl">{home.hero?.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-sand">{home.hero?.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#lead" className="btn btn-light">
              {home.hero?.ctaLabel || 'Рассчитать стоимость'}
            </a>
            <Link href="/catalog" className="btn btn-ghost">
              Смотреть работы
            </Link>
          </div>
        </div>
      </section>

      {categories.docs.length > 0 && (
        <section className="container-site mt-16">
          <h2 className="text-3xl font-serif">Что мы делаем</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.docs.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="rounded-2xl border border-sand bg-white p-6 transition hover:border-caramel hover:shadow-md"
              >
                <p className="text-xl font-bold">{cat.title}</p>
                {cat.description && <p className="mt-2 text-sm text-cocoa-light">{cat.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.docs.length > 0 && (
        <section className="container-site mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-serif">Наши работы</h2>
            <Link href="/catalog" className="font-semibold text-caramel hover:underline">
              Весь каталог →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.docs.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {home.advantages && home.advantages.length > 0 && (
        <section id="advantages" className="container-site mt-20 scroll-mt-20">
          <h2 className="text-3xl font-serif">Почему SOFARIO</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.advantages.map((adv) => (
              <div key={adv.id} className="rounded-2xl bg-cocoa p-6 text-cream">
                <p className="text-lg font-bold text-sand">{adv.title}</p>
                {adv.text && <p className="mt-2 text-sm opacity-90">{adv.text}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {reviews.docs.length > 0 && (
        <section id="reviews" className="container-site mt-20 scroll-mt-20">
          <h2 className="text-3xl font-serif">Отзывы</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.docs.map((r) => (
              <blockquote key={r.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-caramel">{'★'.repeat(r.rating ?? 5)}</p>
                <p className="mt-3">{r.text}</p>
                <footer className="mt-4 font-bold">{r.author}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section id="lead" className="container-site mt-20 max-w-3xl scroll-mt-20">
        <LeadForm />
      </section>
    </>
  )
}
