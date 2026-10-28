# Продакшен-образ SOFARIO. В next.config.ts включён output: 'standalone'.
# Основано на https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# Зависимости
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Сборка
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Рантайм
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next media && chown nextjs:nodejs .next media
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# server.js создаётся next build в режиме standalone
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
