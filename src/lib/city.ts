// Подстановка города в тексты из админки: «Диваны на заказ {город}» → «Диваны на заказ в Самаре»

export const CITY_TOKEN_HINT = 'Можно вставить {город} — подставится, например, «в Самаре» из «Контакты и настройки».'

const TOKEN = /\s*\{город\}/gi

export function withCity(text: string | null | undefined, cityIn: string | null | undefined): string {
  if (!text) return ''
  const city = cityIn?.trim()
  // Без города токен убирается вместе с пробелом перед ним
  return text.replace(TOKEN, city ? ` ${city}` : '').trim()
}
