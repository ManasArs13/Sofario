import type { Metadata } from 'next'

import { LeadForm } from '@/components/LeadForm'
import { routeUrl, WorkshopMap, workshopPoint } from '@/components/WorkshopMap'
import { withCity } from '@/lib/city'
import { getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: 'Контакты',
    description: withCity('Адрес цеха SOFARIO {город}, телефон и часы работы. Приезжайте посмотреть ткани и готовые диваны.', s.cityIn),
  }
}

export default async function ContactsPage() {
  const s = await getSiteSettings()
  const point = workshopPoint(s.location)

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
          {s.location?.directions && (
            <p>
              <span className="block text-sm font-semibold text-caramel">Как добраться</span>
              {s.location.directions}
            </p>
          )}
          {point && (
            <>
              <WorkshopMap point={point} className="mt-6 h-80" />
              <a href={routeUrl(point)} target="_blank" rel="noreferrer" className="btn btn-primary">
                Построить маршрут
              </a>
            </>
          )}
        </div>
        <LeadForm title="Вызвать замерщика" />
      </div>
    </div>
  )
}
