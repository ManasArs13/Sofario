import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { CITY_TOKEN_HINT } from '../lib/city'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Каталог',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField(),
    {
      name: 'seoTitle',
      label: 'Заголовок страницы категории (H1 и title)',
      type: 'text',
      admin: {
        placeholder: 'Угловые диваны на заказ {город}',
        description: `Если пусто — «Название + город». ${CITY_TOKEN_HINT}`,
      },
    },
    { name: 'description', label: 'Краткое описание', type: 'textarea', admin: { description: CITY_TOKEN_HINT } },
    { name: 'image', label: 'Обложка', type: 'upload', relationTo: 'media' },
    {
      name: 'order',
      label: 'Порядок',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Меньше — выше в списке' },
    },
  ],
}
