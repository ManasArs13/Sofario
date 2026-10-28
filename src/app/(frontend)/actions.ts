'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export type LeadFormState = { ok: boolean; error?: string }

const PHONE_RE = /^[+\d][\d\s()-]{9,19}$/

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Ловушка для ботов: скрытое поле, которое человек не заполнит
  if (formData.get('company')) return { ok: true }

  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const workId = Number(formData.get('work')) || undefined

  if (!name || name.length > 100) return { ok: false, error: 'Укажите имя' }
  if (!PHONE_RE.test(phone)) return { ok: false, error: 'Проверьте номер телефона' }
  if (message.length > 3000) return { ok: false, error: 'Слишком длинное сообщение' }
  if (formData.get('consent') !== 'on') {
    return { ok: false, error: 'Нужно согласие на обработку персональных данных' }
  }

  try {
    const payload = await getPayloadClient()
    const referer = (await headers()).get('referer') ?? ''
    await payload.create({
      collection: 'leads',
      data: {
        name,
        phone,
        message,
        work: workId,
        status: 'new',
        source: referer ? new URL(referer).pathname : 'сайт',
      },
    })
    return { ok: true }
  } catch (err) {
    console.error('Ошибка сохранения заявки', err)
    return { ok: false, error: 'Не удалось отправить. Позвоните нам, пожалуйста.' }
  }
}
