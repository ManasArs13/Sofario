import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Контакты и настройки',
  admin: { group: 'Настройки' },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контакты',
          fields: [
            { name: 'phone', label: 'Телефон', type: 'text', required: true, defaultValue: '+7 (900) 000-00-00' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'address', label: 'Адрес цеха', type: 'text' },
            { name: 'workingHours', label: 'Часы работы', type: 'text', defaultValue: 'Пн–Пт 9:00–19:00, Сб 10:00–16:00' },
            {
              name: 'mapEmbedUrl',
              label: 'Ссылка на карту (Яндекс.Карты → «Поделиться» → «Виджет»)',
              type: 'text',
              admin: { description: 'Только адрес из атрибута src, например https://yandex.ru/map-widget/v1/?...' },
            },
          ],
        },
        {
          label: 'Соцсети',
          fields: [
            { name: 'telegram', label: 'Telegram', type: 'text', admin: { placeholder: 'https://t.me/...' } },
            { name: 'whatsapp', label: 'WhatsApp / MAX', type: 'text' },
            { name: 'vk', label: 'ВКонтакте', type: 'text' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', label: 'Заголовок сайта', type: 'text', defaultValue: 'SOFARIO — мягкая мебель на заказ' },
            {
              name: 'metaDescription',
              label: 'Описание для поисковиков',
              type: 'textarea',
              defaultValue: 'Диваны, кресла и кровати на заказ по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.',
            },
          ],
        },
      ],
    },
  ],
}
