import type { Metadata } from 'next'
import { Cormorant_Garamond, Marcellus, Montserrat } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { withCity } from '@/lib/city'
import { getSiteSettings } from '@/lib/payload'

import './globals.css'

// Шрифты скачиваются при сборке и раздаются с нашего сервера — без запросов к Google у посетителей
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat', display: 'swap' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})
// Только для слова SOFARIO: в Marcellus нет кириллицы
const marcellus = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-marcellus', display: 'swap' })

// Контент берётся из БД при каждом запросе — правки в админке видны сразу
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const suffix = withCity(settings.titleSuffix, settings.cityIn) || 'SOFARIO'
  return {
    title: { default: withCity(settings.metaTitle, settings.cityIn) || 'SOFARIO', template: `%s — ${suffix}` },
    description: withCity(settings.metaDescription, settings.cityIn) || undefined,
    icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="ru" className={`${montserrat.variable} ${cormorant.variable} ${marcellus.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader phone={settings.phone} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
