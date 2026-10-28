import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'

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
    { name: 'description', label: 'Краткое описание', type: 'textarea' },
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
