import type { CollectionConfig } from 'payload'

import { isAdmin, loggedIn } from '../access'
import { notifyTelegram } from '../lib/telegram'

export const LEAD_STATUSES = [
  { label: 'Новая', value: 'new' },
  { label: 'Связались', value: 'contacted' },
  { label: 'Замер', value: 'measure' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Сдана', value: 'done' },
  { label: 'Отказ', value: 'rejected' },
]

// Заявки с сайта. Создаются только серверным экшеном формы (через Local API),
// поэтому публичный REST-доступ на создание закрыт — меньше спама.
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'createdAt'],
    group: 'Клиенты',
    listSearchableFields: ['name', 'phone', 'email'],
  },
  defaultSort: '-createdAt',
  access: {
    read: loggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Имя', type: 'text', required: true },
        { name: 'phone', label: 'Телефон', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
    },
    { name: 'message', label: 'Что нужно сделать', type: 'textarea' },
    { name: 'category', label: 'Интересует', type: 'relationship', relationTo: 'categories' },
    { name: 'work', label: 'Со страницы работы', type: 'relationship', relationTo: 'works' },
    { name: 'attachments', label: 'Эскизы / фото', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: LEAD_STATUSES,
      admin: { position: 'sidebar' },
    },
    {
      name: 'manager',
      label: 'Ответственный',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    { name: 'budget', label: 'Сумма заказа, ₽', type: 'number', admin: { position: 'sidebar' } },
    { name: 'notes', label: 'Заметки менеджера', type: 'textarea' },
    {
      name: 'source',
      label: 'Источник',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        try {
          await notifyTelegram(
            [
              '🛋 <b>Новая заявка SOFARIO</b>',
              `Имя: ${doc.name}`,
              `Телефон: ${doc.phone}`,
              doc.email ? `Email: ${doc.email}` : '',
              doc.message ? `\n${doc.message}` : '',
            ]
              .filter(Boolean)
              .join('\n'),
          )
        } catch (err) {
          req.payload.logger.error({ err, msg: 'Не удалось отправить заявку в Telegram' })
        }
      },
    ],
  },
}
