import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

// Изделия и выполненные работы (портфолио) — основа каталога на сайте
export const Works: CollectionConfig = {
  slug: 'works',
  labels: { singular: 'Работа', plural: 'Работы / Каталог' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'priceFrom', 'featured', '_status'],
    group: 'Каталог',
    preview: (doc) => (doc?.slug ? `/catalog/${doc.slug}` : null),
  },
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    slugField(),
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Показывать на главной',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'cover', label: 'Главное фото', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'excerpt', label: 'Короткое описание', type: 'textarea' },
    { name: 'description', label: 'Подробное описание', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'priceFrom', label: 'Цена от, ₽', type: 'number', min: 0 },
        { name: 'dimensions', label: 'Размеры', type: 'text', admin: { placeholder: '2400 × 1000 × 850 мм' } },
        { name: 'leadTime', label: 'Срок изготовления', type: 'text', admin: { placeholder: '2–4 недели' } },
      ],
    },
    {
      name: 'mechanism',
      label: 'Механизм трансформации',
      type: 'select',
      options: [
        { label: 'Без механизма', value: 'none' },
        { label: 'Еврокнижка', value: 'eurobook' },
        { label: 'Дельфин', value: 'dolphin' },
        { label: 'Аккордеон', value: 'accordion' },
        { label: 'Пантограф', value: 'pantograph' },
        { label: 'Французская раскладушка', value: 'french' },
        { label: 'Реклайнер', value: 'recliner' },
        { label: 'Подъёмный (кровать)', value: 'lift' },
      ],
    },
    {
      name: 'materials',
      label: 'Ткани и материалы',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
    },
  ],
}
