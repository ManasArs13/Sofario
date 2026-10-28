import type { CollectionConfig } from 'payload'

import { loggedIn } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'approved', 'createdAt'],
    group: 'Клиенты',
  },
  access: {
    // На сайте видны только одобренные отзывы
    read: ({ req: { user } }) => (user ? true : { approved: { equals: true } }),
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'author', label: 'Имя клиента', type: 'text', required: true },
    { name: 'text', label: 'Текст отзыва', type: 'textarea', required: true },
    { name: 'rating', label: 'Оценка', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'work', label: 'К какой работе', type: 'relationship', relationTo: 'works' },
    { name: 'photo', label: 'Фото', type: 'upload', relationTo: 'media' },
    {
      name: 'approved',
      label: 'Опубликован',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
