# SOFARIO — мягкая мебель на заказ

Сайт цеха мягкой мебели: диваны, кресла, кровати, перетяжка.

Next.js 16 + Payload CMS 3 (админка) + PostgreSQL 17 + Tailwind CSS 4.

## Быстрый старт

```bash
pnpm install
cp .env.example .env          # и впишите свой PAYLOAD_SECRET
pnpm db:up                    # PostgreSQL в Docker на порту 5433
pnpm seed                     # стартовые категории, ткани, преимущества
pnpm dev
```

- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin — при первом входе создайте пользователя, он станет администратором.

## Структура

```
src/
  payload.config.ts        конфиг админки (русский язык, логотип, БД)
  collections/             Заявки, Работы, Категории, Материалы, Отзывы, Медиа, Пользователи
  globals/                 Главная страница, Контакты и настройки
  access/                  права: администратор / менеджер
  app/(frontend)/          страницы сайта: главная, каталог, работа, контакты, политика
  app/(payload)/           админка и API (генерируется Payload, не править)
  components/              шапка, подвал, карточка работы, форма заявки
  components/brand/        знак-диван и минилого для сайта и админки
  migrations/              миграции БД для продакшена
  seed.ts                  стартовые данные
scripts/build-brand.mjs    генератор фирменной графики (pnpm brand)
public/brand/              логотип, минилого, иконка (SVG + PNG)
```

## Фирменный стиль

| Файл | Для чего |
|---|---|
| `public/brand/logo.svg` | Полный логотип: диван, SOFARIO, «мягкая мебель на заказ» |
| `public/brand/logo-mini.svg` | Минилого в строку: шапка сайта, документы, подписи писем |
| `public/brand/icon.svg`, `icon-192/512.png` | Иконка: favicon, аватар соцсетей, ярлык на телефоне |
| `public/favicon.svg`, `apple-touch-icon.png` | Подключены на сайте и в админке |

Цвета: обивка `#6B4F3A`, текст `#4A3626`, подушка `#C9AE90`, фон `#F5EFE6`.
Шрифты: Marcellus — только для слова SOFARIO (в нём нет кириллицы), Cormorant Garamond — заголовки, Montserrat — текст.
После правки знака в `scripts/build-brand.mjs` перенесите геометрию в `src/components/brand/Sofa.tsx` и запустите `pnpm brand`.

## Как это работает

- **Заявки** с форм сохраняются в коллекцию «Заявки» (серверный экшен, ловушка от ботов, согласие по 152-ФЗ).
  Если заданы `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`, о каждой новой заявке приходит сообщение в Telegram.
- **Работы** — карточки изделий: размеры, механизм трансформации, ткани. Поддерживают черновики: на сайте видны только опубликованные.
  Галочка «Показывать на главной» выводит работу в блоке «Наши работы».
- **Отзывы** появляются на сайте после галочки «Опубликован».
- **Роли:** администратор управляет всем, включая пользователей и контакты; менеджер — заявками и контентом.

## Изменение схемы данных

В разработке Payload сам синхронизирует таблицы. Перед выкладкой изменений создайте миграцию:

```bash
pnpm migrate:create add-something
```

В продакшене миграции применяются автоматически при старте приложения.

## CI/CD (GitHub Actions)

| Workflow | Когда | Что делает |
|---|---|---|
| [`ci.yml`](.github/workflows/ci.yml) | pull request и пуш в любую ветку, кроме `main` | ESLint, TypeScript, проверка, что `payload-types.ts` и import map перегенерированы; миграции на чистой БД; проверка, что изменения коллекций не забыли оформить миграцией; `next build` |
| [`deploy.yml`](.github/workflows/deploy.yml) | пуш в `main` или ручной запуск | Те же проверки CI → Docker-образ в GitHub Container Registry (`ghcr.io/manasars13/sofario:latest` и `:sha-xxxxxxx`) → деплой на VPS по SSH → проверка, что сайт отвечает |

Пока не задана переменная `DEPLOY_HOST`, шаг деплоя пропускается: образ собирается и публикуется, но на сервер не выкатывается.

### Подготовка сервера (один раз)

```bash
# на VPS (Ubuntu): Docker + пользователь для деплоя
curl -fsSL https://get.docker.com | sh
sudo adduser --disabled-password deploy && sudo usermod -aG docker deploy
sudo mkdir -p /opt/sofario && sudo chown deploy:deploy /opt/sofario
# положите в /opt/sofario/.env боевые значения по образцу .env.example:
# PAYLOAD_SECRET, POSTGRES_PASSWORD, NEXT_PUBLIC_SERVER_URL, TELEGRAM_*
```

Создайте SSH-ключ только для деплоя, публичную часть добавьте в `/home/deploy/.ssh/authorized_keys`.

### Настройки в GitHub (Settings → Secrets and variables → Actions)

| Тип | Имя | Значение |
|---|---|---|
| Variable | `DEPLOY_HOST` | IP или домен сервера |
| Variable | `DEPLOY_USER` | `deploy` (по умолчанию) |
| Variable | `DEPLOY_PATH` | `/opt/sofario` (по умолчанию) |
| Variable | `SITE_URL` | `https://ваш-домен.ru` — для проверки после деплоя |
| Secret | `DEPLOY_SSH_KEY` | приватный SSH-ключ |
| Secret | `DEPLOY_SSH_PORT` | порт SSH, если не 22 |

Деплой привязан к окружению `production`: в Settings → Environments можно включить ручное подтверждение каждой выкладки.

### Откат

На сервере в `/opt/sofario/.deployed-image` записан текущий образ. Откатиться на прошлую версию:

```bash
cd /opt/sofario
APP_IMAGE=ghcr.io/manasars13/sofario:sha-<прошлый коммит> docker compose --profile prod up -d --no-build
```

Миграции БД откатываются отдельно (`pnpm payload migrate:down`), поэтому изменения схемы лучше делать обратно совместимыми.

## Продакшен вручную (без GitHub)

```bash
# на сервере: заполните .env (свой PAYLOAD_SECRET, POSTGRES_PASSWORD, NEXT_PUBLIC_SERVER_URL)
docker compose --profile prod up -d --build
```

Приложение слушает `127.0.0.1:3000`. Перед ним поставьте Caddy или Nginx с HTTPS.
Загруженные фото лежат в томе `media`; бэкап БД делается через `pg_dump`.

## Что дальше

- Калькулятор стоимости (цены тканей за м² уже лежат в «Материалах»).
- Каталог тканей с фильтром по цвету и типу.
- Хранение фото в S3 (`@payloadcms/storage-s3` + Yandex Object Storage).
- Отправка почты (`@payloadcms/email-nodemailer` + SMTP Яндекса).
- Яндекс.Метрика, sitemap.xml, разметка schema.org.
