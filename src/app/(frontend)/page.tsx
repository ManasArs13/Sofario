import Image from 'next/image'
import Link from 'next/link'

import { LeadForm } from '@/components/LeadForm'
import { WorkCard } from '@/components/WorkCard'
import { routeUrl, WorkshopMap, workshopPoint } from '@/components/WorkshopMap'
import { withCity } from '@/lib/city'
import { getPayloadClient, getSiteSettings, mediaUrl } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

// Разметка schema.org: поисковики покажут адрес, телефон и точку на карте в карточке организации
function localBusinessJsonLd(s: SiteSetting, point: ReturnType<typeof workshopPoint>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'SOFARIO',
    description: 'Мягкая мебель на заказ: диваны, кресла, кровати, перетяжка',
    telephone: s.phone,
    ...(s.email && { email: s.email }),
    ...(process.env.NEXT_PUBLIC_SERVER_URL && { url: process.env.NEXT_PUBLIC_SERVER_URL }),
    ...((s.address || s.city) && {
      address: {
        '@type': 'PostalAddress',
        ...(s.address && { streetAddress: s.address }),
        ...(s.city && { addressLocality: s.city }),
        ...(s.region && { addressRegion: s.region }),
        addressCountry: 'RU',
      },
    }),
    ...(s.city && { areaServed: { '@type': 'City', name: s.city } }),
    ...(point && { geo: { '@type': 'GeoCoordinates', latitude: point.lat, longitude: point.lng } }),
  }
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, settings, categories, featured, reviews] = await Promise.all([
    payload.findGlobal({ slug: 'home-page' }),
    getSiteSettings(),
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
  const point = workshopPoint(settings.location)

  return (
    <>
      <section className="relative overflow-hidden bg-cocoa text-cream">
        {heroImage && (
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        )}
        <div className="container-site relative py-24 sm:py-32">
          <h1 className="max-w-3xl text-4xl leading-tight font-serif sm:text-6xl">{withCity(home.hero?.title, settings.cityIn)}</h1>
          <p className="mt-6 max-w-2xl text-lg text-sand">{withCity(home.hero?.subtitle, settings.cityIn)}</p>
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
                {cat.description && <p className="mt-2 text-sm text-cocoa-light">{withCity(cat.description, settings.cityIn)}</p>}
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

      {point && settings.location?.showOnHome && (
        <section id="workshop" className="container-site mt-20 scroll-mt-20">
          <h2 className="text-3xl font-serif">Приезжайте в цех</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-4">
              {settings.address && (
                <p>
                  <span className="block text-sm font-semibold text-caramel">Адрес</span>
                  <span className="text-lg">{settings.address}</span>
                </p>
              )}
              {settings.workingHours && (
                <p>
                  <span className="block text-sm font-semibold text-caramel">Часы работы</span>
                  {settings.workingHours}
                </p>
              )}
              {settings.location?.directions && (
                <p>
                  <span className="block text-sm font-semibold text-caramel">Как добраться</span>
                  {settings.location.directions}
                </p>
              )}
              <p className="text-cocoa-light">
                Покажем каркасы, образцы тканей и наполнителей, посидите на готовых диванах.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={routeUrl(point)} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Построить маршрут
                </a>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="btn border border-cocoa-light">
                  Позвонить
                </a>
              </div>
            </div>
            <WorkshopMap point={point} className="h-80 lg:h-[420px]" />
          </div>
        </section>
      )}

      <section id="lead" className="container-site mt-20 max-w-3xl scroll-mt-20">
        <LeadForm />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // экранируем «<», чтобы текст из админки не мог закрыть тег <script>
          __html: JSON.stringify(localBusinessJsonLd(settings, point)).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
