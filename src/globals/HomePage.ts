import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { CITY_TOKEN_HINT } from '../lib/city'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Главная страница',
  admin: { group: 'Контент' },
  access: { read: anyone, update: loggedIn },
  fields: [
    {
      name: 'hero',
      label: 'Первый экран',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Заголовок',
          type: 'text',
          defaultValue: 'Диваны и кресла, сшитые под вас {город}',
          admin: { description: CITY_TOKEN_HINT },
        },
        {
          name: 'subtitle',
          label: 'Подзаголовок',
          type: 'textarea',
          admin: { description: CITY_TOKEN_HINT },
          defaultValue: 'Любой размер, ткань и наполнитель. Шьём в собственном цеху, привезём образцы тканей бесплатно.',
        },
        { name: 'image', label: 'Фоновое фото', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', label: 'Текст кнопки', type: 'text', defaultValue: 'Рассчитать стоимость' },
      ],
    },
    {
      name: 'advantages',
      label: 'Преимущества',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Преимущество', plural: 'Преимущества' },
      fields: [
        { name: 'title', label: 'Заголовок', type: 'text', required: true },
        { name: 'text', label: 'Текст', type: 'textarea' },
      ],
    },
  ],
}
