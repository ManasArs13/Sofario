import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

type MediaSize = 'thumbnail' | 'card' | 'hero'

// Поле upload может прийти как id или как объект — достаём url нужного размера
export function mediaUrl(media: number | Media | null | undefined, size?: MediaSize): string | null {
  if (!media || typeof media === 'number') return null
  return (size && media.sizes?.[size]?.url) || media.url || null
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value) + ' ₽'
