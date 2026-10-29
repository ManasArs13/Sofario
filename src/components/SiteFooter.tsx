import Link from 'next/link'

import { withCity } from '@/lib/city'

import { brandColors, Sofa } from './brand/Sofa'

import type { SiteSetting } from '@/payload-types'

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const socials = [
    { href: settings.telegram, label: 'Telegram' },
    { href: settings.whatsapp, label: 'WhatsApp' },
    { href: settings.vk, label: 'ВКонтакте' },
  ].filter((s): s is { href: string; label: string } => Boolean(s.href))

  return (
    <footer className="mt-20 bg-cocoa py-10 text-sm text-sand">
      <div className="container-site grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Sofa width={52} body={brandColors.cream} cut={brandColors.ink} />
            <span className="font-brand text-2xl tracking-[0.12em] text-cream">SOFARIO</span>
          </div>
          <p className="mt-3">{withCity('Мягкая мебель на заказ {город}: диваны, кресла, кровати', settings.cityIn)}</p>
        </div>
        <div className="space-y-1">
          <p>{settings.phone}</p>
          {settings.email && <p>{settings.email}</p>}
          {(settings.city || settings.address) && <p>{[settings.city, settings.address].filter(Boolean).join(', ')}</p>}
          {settings.workingHours && <p>{settings.workingHours}</p>}
        </div>
        <div className="space-y-1">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="block hover:text-cream" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
          <Link href="/privacy" className="block hover:text-cream">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
      <p className="container-site mt-8 text-xs opacity-60">© {new Date().getFullYear()} SOFARIO — мягкая мебель на заказ</p>
    </footer>
  )
}
