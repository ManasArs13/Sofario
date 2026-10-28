// Генерирует фирменную графику SOFARIO в public/: логотип, минилого, иконку, favicon и PNG-иконки.
// Запуск: pnpm brand
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const out = path.resolve('public')
const brandDir = path.join(out, 'brand')
fs.mkdirSync(brandDir, { recursive: true })

export const colors = {
  body: '#6B4F3A', // обивка
  ink: '#4A3626', // текст
  pillow: '#C9AE90', // подушка
  cream: '#F5EFE6', // фон
}

const SERIF = `Marcellus, 'Cormorant Garamond', Georgia, 'Times New Roman', serif`
const SANS = `Montserrat, 'Segoe UI', Arial, sans-serif`

// Диван в системе координат 220 × 120. cut — цвет «прорезей» между деталями (обычно цвет фона)
const sofa = ({ body = colors.body, pillow = colors.pillow, cut = colors.cream } = {}) => `
    <rect x="10" y="10" width="150" height="46" rx="23" fill="${body}"/>
    <path d="M150 92 L170 38 C174 26 184 20 196 22 C208 24 212 34 209 46 L196 92 Z" fill="${body}"/>
    <polygon points="120,54 140,25 176,25 160,54" fill="${pillow}" stroke="${cut}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="10" y="54" width="168" height="38" rx="19" fill="${body}" stroke="${cut}" stroke-width="5"/>
    <polygon points="40,90 51,90 37,113 30,113" fill="${body}"/>
    <polygon points="183,90 194,90 205,113 198,113" fill="${body}"/>
    <ellipse cx="112" cy="114" rx="104" ry="2" fill="${body}"/>`

// Полный логотип: диван, название и подпись (на светлом фоне)
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <rect width="640" height="440" fill="${colors.cream}"/>
  <g transform="translate(166 30) scale(1.4)">${sofa()}
  </g>
  <text x="320" y="296" text-anchor="middle" font-family="${SERIF}" font-size="92" letter-spacing="10" fill="${colors.ink}">SOFARIO</text>
  <line x1="40" y1="352" x2="128" y2="352" stroke="${colors.body}" stroke-width="1.5"/>
  <line x1="512" y1="352" x2="600" y2="352" stroke="${colors.body}" stroke-width="1.5"/>
  <text x="320" y="358" text-anchor="middle" font-family="${SANS}" font-size="17" letter-spacing="6" fill="${colors.body}">МЯГКАЯ МЕБЕЛЬ НА ЗАКАЗ</text>
</svg>
`

// Минилого: диван + название в одну строку, прозрачный фон (для шапки, документов, писем)
const logoMini = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 84" width="420" height="84">
  <g transform="translate(0 6) scale(0.6)">${sofa()}
  </g>
  <text x="146" y="58" font-family="${SERIF}" font-size="50" letter-spacing="5" fill="${colors.ink}">SOFARIO</text>
</svg>
`

// Иконка: светлый диван на коричневом квадрате (favicon, иконка приложения, аватар соцсетей)
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="${colors.body}"/>
  <g transform="translate(58 150) scale(1.8)">${sofa({ body: colors.cream, pillow: colors.pillow, cut: colors.body })}
  </g>
</svg>
`

fs.writeFileSync(path.join(brandDir, 'logo.svg'), logo)
fs.writeFileSync(path.join(brandDir, 'logo-mini.svg'), logoMini)
fs.writeFileSync(path.join(brandDir, 'icon.svg'), icon)
fs.writeFileSync(path.join(out, 'favicon.svg'), icon)

const png = (svg, size, file) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(out, file))
await png(icon, 180, 'apple-touch-icon.png')
await png(icon, 192, 'brand/icon-192.png')
await png(icon, 512, 'brand/icon-512.png')

console.log('Графика SOFARIO сохранена в public/ и public/brand/')
