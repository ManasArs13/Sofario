import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: { singular: 'Материал', plural: 'Материалы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'pricePerM2'],
    group: 'Каталог',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true },
    {
      name: 'kind',
      label: 'Тип',
      type: 'select',
      required: true,
      options: [
        { label: 'Ткань', value: 'fabric' },
        { label: 'Экокожа', value: 'eco_leather' },
        { label: 'Натуральная кожа', value: 'leather' },
        { label: 'Наполнитель', value: 'filler' },
        { label: 'Каркас', value: 'frame' },
        { label: 'Механизм', value: 'mechanism' },
        { label: 'Другое', value: 'other' },
      ],
    },
    {
      name: 'supplier',
      label: 'Коллекция / поставщик',
      type: 'text',
      admin: { placeholder: 'Например, Bentley, Adele, Velutto' },
    },
    {
      name: 'pricePerM2',
      label: 'Цена за м² (или за единицу), ₽',
      type: 'number',
      min: 0,
      admin: { description: 'Используется в калькуляторе стоимости' },
    },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'image', label: 'Фото образца', type: 'upload', relationTo: 'media' },
  ],
}
