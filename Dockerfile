# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci


# ==========================================
# Stage 2: Build
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./

COPY . .

# Next.js public environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENABLE_ADMIN_BYPASS

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENABLE_ADMIN_BYPASS=$NEXT_PUBLIC_ENABLE_ADMIN_BYPASS

RUN npm run build


# ==========================================
# Stage 3: Production
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy Next.js standalone application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]