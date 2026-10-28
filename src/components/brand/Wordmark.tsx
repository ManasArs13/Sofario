import { Sofa } from './Sofa'

// Минилого: диван + SOFARIO в одну строку. Шрифт Marcellus подключается в layout сайта
export function Wordmark({ height = 40, tagline = false }: { height?: number; tagline?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Sofa width={height * 1.6} />
      <span className="leading-none">
        <span className="font-brand block tracking-[0.12em] text-cocoa" style={{ fontSize: height * 0.72 }}>
          SOFARIO
        </span>
        {tagline && (
          <span className="mt-1 block text-[10px] font-semibold tracking-[0.28em] text-cocoa-light">
            МЯГКАЯ МЕБЕЛЬ НА ЗАКАЗ
          </span>
        )}
      </span>
    </span>
  )
}
