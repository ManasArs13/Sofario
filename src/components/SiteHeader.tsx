import Link from 'next/link'

import { Wordmark } from './brand/Wordmark'

const nav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/#advantages', label: 'О цехе' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/contacts', label: 'Контакты' },
]

export function SiteHeader({ phone }: { phone: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-sand/50 bg-cream/95 backdrop-blur">
      <div className="container-site flex h-18 items-center justify-between gap-4">
        <Link href="/" aria-label="SOFARIO — на главную">
          <Wordmark height={34} />
        </Link>
        <nav className="hidden gap-7 text-sm font-medium md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-caramel">
              {item.label}
            </Link>
          ))}
        </nav>
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hidden text-sm font-semibold whitespace-nowrap sm:block">
          {phone}
        </a>
      </div>
    </header>
  )
}
