import type { Metadata } from 'next'

import { LeadForm } from '@/components/LeadForm'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Контакты' }

export default async function ContactsPage() {
  const payload = await getPayloadClient()
  const s = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <div className="container-site py-12">
      <h1 className="text-4xl font-serif">Контакты</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-lg">
          <p>
            <span className="block text-sm font-semibold text-caramel">Телефон</span>
            <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="font-bold">{s.phone}</a>
          </p>
          {s.email && (
            <p>
              <span className="block text-sm font-semibold text-caramel">Email</span>
              <a href={`mailto:${s.email}`}>{s.email}</a>
            </p>
          )}
          {s.address && (
            <p>
              <span className="block text-sm font-semibold text-caramel">Адрес цеха</span>
              {s.address}
            </p>
          )}
          {s.workingHours && (
            <p>
              <span className="block text-sm font-semibold text-caramel">Часы работы</span>
              {s.workingHours}
            </p>
          )}
          {s.mapEmbedUrl?.startsWith('https://yandex.ru/map-widget/') && (
            <iframe src={s.mapEmbedUrl} title="Карта" className="mt-6 h-80 w-full rounded-2xl border-0" loading="lazy" />
          )}
        </div>
        <LeadForm title="Вызвать замерщика" />
      </div>
    </div>
  )
}
