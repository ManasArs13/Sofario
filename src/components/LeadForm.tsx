'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { submitLead, type LeadFormState } from '@/app/(frontend)/actions'

export function LeadForm({ workId, title = 'Рассчитаем стоимость за 1 день' }: { workId?: number; title?: string }) {
  const [state, action, pending] = useActionState<LeadFormState, FormData>(submitLead, { ok: false })

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-2xl font-bold">Спасибо! Заявка принята</p>
        <p className="mt-2 text-cocoa-light">Мастер перезвонит вам в течение рабочего дня.</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <p className="text-2xl font-bold">{title}</p>
      {workId && <input type="hidden" name="work" value={workId} />}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="name" placeholder="Ваше имя" required maxLength={100} autoComplete="name" />
        <input className="field" name="phone" type="tel" placeholder="+7 (___) ___-__-__" required autoComplete="tel" />
      </div>
      <textarea className="field min-h-28" name="message" placeholder="Что нужно: диван, кресло, кровать — размеры, ткань, пожелания" maxLength={3000} />
      <label className="flex items-start gap-2 text-sm text-cocoa-light">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          Согласен на обработку персональных данных согласно{' '}
          <Link href="/privacy" className="underline">политике конфиденциальности</Link>
        </span>
      </label>
      {state.error && <p className="text-sm font-semibold text-red-700">{state.error}</p>}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Отправляем…' : 'Отправить заявку'}
      </button>
    </form>
  )
}
