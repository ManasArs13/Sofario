import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { CITY_TOKEN_HINT } from '../lib/city'

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
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  label: 'Город',
                  type: 'text',
                  admin: { placeholder: 'Самара', description: 'Для адреса и разметки для поисковиков' },
                },
                {
                  name: 'cityIn',
                  label: 'Город в тексте («в …»)',
                  type: 'text',
                  admin: {
                    placeholder: 'в Самаре',
                    description: 'Подставляется вместо {город} в заголовках и описаниях',
                  },
                },
                { name: 'region', label: 'Регион', type: 'text', admin: { placeholder: 'Самарская область' } },
              ],
            },
            { name: 'phone', label: 'Телефон', type: 'text', required: true, defaultValue: '+7 (900) 000-00-00' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'address', label: 'Адрес цеха', type: 'text' },
            { name: 'workingHours', label: 'Часы работы', type: 'text', defaultValue: 'Пн–Пт 9:00–19:00, Сб 10:00–16:00' },
          ],
        },
        {
          label: 'Расположение цеха',
          fields: [
            {
              name: 'location',
              label: false,
              type: 'group',
              fields: [
                {
                  name: 'picker',
                  type: 'ui',
                  admin: {
                    components: { Field: '/components/admin/LocationPicker#LocationPicker' },
                  },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'lat', label: 'Широта', type: 'number', min: -90, max: 90, admin: { step: 0.000001 } },
                    { name: 'lng', label: 'Долгота', type: 'number', min: -180, max: 180, admin: { step: 0.000001 } },
                    { name: 'zoom', label: 'Масштаб карты', type: 'number', min: 3, max: 19, defaultValue: 16 },
                  ],
                },
                {
                  name: 'showOnHome',
                  label: 'Показывать карту на главной странице',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'directions',
                  label: 'Как добраться',
                  type: 'textarea',
                  admin: { placeholder: 'Въезд с ул. Заводской, ворота №3, второй этаж. Парковка у входа.' },
                },
              ],
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
            {
              name: 'metaTitle',
              label: 'Заголовок сайта (title главной)',
              type: 'text',
              defaultValue: 'Мягкая мебель на заказ {город} — SOFARIO',
              admin: { description: CITY_TOKEN_HINT },
            },
            {
              name: 'metaDescription',
              label: 'Описание для поисковиков',
              type: 'textarea',
              defaultValue:
                'Диваны, кресла и кровати на заказ {город} по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.',
              admin: { description: CITY_TOKEN_HINT },
            },
            {
              name: 'titleSuffix',
              label: 'Хвост title внутренних страниц',
              type: 'text',
              defaultValue: 'мягкая мебель на заказ {город} | SOFARIO',
              admin: {
                description: `Добавляется после названия страницы: «Каталог — <хвост>». ${CITY_TOKEN_HINT}`,
              },
            },
          ],
        },
      ],
    },
  ],
}
