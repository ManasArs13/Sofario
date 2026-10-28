// Знак SOFARIO — диван. Геометрия совпадает с scripts/build-brand.mjs (при правке меняйте оба места)
export const brandColors = {
  body: '#6B4F3A',
  ink: '#4A3626',
  pillow: '#C9AE90',
  cream: '#F5EFE6',
}

type Props = {
  width?: number
  body?: string
  pillow?: string
  /** Цвет «прорезей» между деталями — обычно цвет фона под знаком */
  cut?: string
}

export function Sofa({ width = 66, body = brandColors.body, pillow = brandColors.pillow, cut = brandColors.cream }: Props) {
  return (
    <svg width={width} height={(width * 120) / 220} viewBox="0 0 220 120" aria-hidden="true">
      <rect x="10" y="10" width="150" height="46" rx="23" fill={body} />
      <path d="M150 92 L170 38 C174 26 184 20 196 22 C208 24 212 34 209 46 L196 92 Z" fill={body} />
      <polygon points="120,54 140,25 176,25 160,54" fill={pillow} stroke={cut} strokeWidth="4" strokeLinejoin="round" />
      <rect x="10" y="54" width="168" height="38" rx="19" fill={body} stroke={cut} strokeWidth="5" />
      <polygon points="40,90 51,90 37,113 30,113" fill={body} />
      <polygon points="183,90 194,90 205,113 198,113" fill={body} />
      <ellipse cx="112" cy="114" rx="104" ry="2" fill={body} />
    </svg>
  )
}

// Квадратная иконка: светлый диван на коричневом фоне
export function SofaIcon({ size = 32 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: brandColors.body,
      }}
    >
      <Sofa width={size * 0.76} body={brandColors.cream} cut={brandColors.body} />
    </span>
  )
}
