const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Отправка уведомления в Telegram. Без TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID тихо ничего не делает.
export async function notifyTelegram(html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  // Экранируем всё, кроме наших собственных <b>-тегов
  const text = escapeHtml(html).replace(/&lt;(\/?)b&gt;/g, '<$1b>')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
  if (!res.ok) throw new Error(`Telegram API: ${res.status} ${await res.text()}`)
}
