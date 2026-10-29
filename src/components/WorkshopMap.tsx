import type { SiteSetting } from '@/payload-types'

type Location = NonNullable<SiteSetting['location']>
type Point = { lat: number; lng: number; zoom: number }

export function workshopPoint(location: Location | null | undefined): Point | null {
  if (typeof location?.lat !== 'number' || typeof location?.lng !== 'number') return null
  return { lat: location.lat, lng: location.lng, zoom: location.zoom ?? 16 }
}

// Маршрут в Яндекс.Картах от текущего места посетителя до цеха
export const routeUrl = ({ lat, lng }: Point) => `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=auto`

// Виджет Яндекс.Карт с меткой цеха — работает без API-ключа
export function WorkshopMap({ point, className = '' }: { point: Point; className?: string }) {
  const src = `https://yandex.ru/map-widget/v1/?ll=${point.lng},${point.lat}&z=${point.zoom}&pt=${point.lng},${point.lat},pm2brm`
  return (
    <iframe
      src={src}
      title="Цех SOFARIO на карте"
      loading="lazy"
      allowFullScreen
      className={`w-full rounded-2xl border-0 bg-sand/30 ${className}`}
    />
  )
}
