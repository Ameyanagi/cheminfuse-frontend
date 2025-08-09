# Multi-stage build for Next.js application
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_TORCHANI_API_URL=https://torchani.ameyanagi.com/torchani/api/v1
ARG NEXT_PUBLIC_WS_URL=wss://torchani.ameyanagi.com/torchani/ws

ENV NEXT_PUBLIC_TORCHANI_API_URL=$NEXT_PUBLIC_TORCHANI_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]