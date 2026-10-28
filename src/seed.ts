// Стартовые данные: категории, ткани и материалы, преимущества. Запуск: pnpm seed
import { getPayload } from 'payload'

import config from './payload.config'

const categories = [
  { title: 'Прямые диваны', description: 'Диваны любого размера: от компактных двухместных до гостиных на 4 метра', order: 10 },
  { title: 'Угловые и модульные', description: 'Угловые диваны и модульные системы под вашу планировку', order: 20 },
  { title: 'Кресла', description: 'Кресла для отдыха, реклайнеры и кресла-кровати', order: 30 },
  { title: 'Кровати', description: 'Кровати с мягким изголовьем и подъёмным механизмом', order: 40 },
  { title: 'Пуфы и банкетки', description: 'Пуфы, банкетки и оттоманки в прихожую, спальню и гостиную', order: 50 },
  { title: 'Перетяжка и ремонт', description: 'Новая ткань, наполнитель и механизм для вашей мебели', order: 60 },
  { title: 'Для бизнеса', description: 'Диваны и банкетки для кафе, ресторанов, отелей и офисов', order: 70 },
]

const materials = [
  { title: 'Велюр', kind: 'fabric', pricePerM2: 1400 },
  { title: 'Рогожка', kind: 'fabric', pricePerM2: 1100 },
  { title: 'Шенилл', kind: 'fabric', pricePerM2: 1600 },
  { title: 'Микровелюр «антикоготь»', kind: 'fabric', pricePerM2: 1800 },
  { title: 'Экокожа', kind: 'eco_leather', pricePerM2: 1500 },
  { title: 'Натуральная кожа', kind: 'leather', pricePerM2: 6500 },
  { title: 'ППУ высокоэластичный HR', kind: 'filler' },
  { title: 'Независимый пружинный блок', kind: 'filler' },
  { title: 'Каркас из массива берёзы', kind: 'frame' },
  { title: 'Механизм «Дельфин»', kind: 'mechanism' },
] as const

const payload = await getPayload({ config })

for (const data of categories) {
  const { totalDocs } = await payload.count({ collection: 'categories', where: { title: { equals: data.title } } })
  if (!totalDocs) await payload.create({ collection: 'categories', data })
}
for (const data of materials) {
  const { totalDocs } = await payload.count({ collection: 'materials', where: { title: { equals: data.title } } })
  if (!totalDocs) await payload.create({ collection: 'materials', data: { ...data } })
}
await payload.updateGlobal({
  slug: 'home-page',
  data: {
    advantages: [
      { title: 'Свой цех', text: 'Каркас, крой, пошив и сборка — всё делаем сами, без посредников' },
      { title: '300+ тканей', text: 'Привезём образцы домой бесплатно, поможем подобрать цвет и фактуру' },
      { title: 'Любой размер', text: 'Подгоняем глубину, высоту и длину под ваш интерьер с точностью до сантиметра' },
      { title: 'Гарантия 2 года', text: 'На каркас, наполнитель и механизмы трансформации — по договору' },
    ],
  },
})
payload.logger.info('Сид выполнен: категории, материалы и преимущества добавлены')
process.exit(0)
