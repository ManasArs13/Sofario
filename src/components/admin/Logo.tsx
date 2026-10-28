import { brandColors, Sofa } from '../brand/Sofa'

// Логотип на странице входа в админку
export function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Sofa width={150} />
      <div
        style={{
          fontFamily: "Marcellus, 'Cormorant Garamond', Georgia, serif",
          fontSize: 44,
          letterSpacing: 6,
          lineHeight: 1,
          color: brandColors.ink,
        }}
      >
        SOFARIO
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, color: brandColors.body }}>
        МЯГКАЯ МЕБЕЛЬ НА ЗАКАЗ
      </div>
    </div>
  )
}
