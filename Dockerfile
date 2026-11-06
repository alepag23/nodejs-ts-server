# ---------- STEP 1: Builder ----------
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /usr/src/app
ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---------- STEP 2: Runner ----------
FROM node:22-alpine AS runner
RUN corepack enable
WORKDIR /usr/src/app
ENV NODE_ENV=production CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000
CMD ["node", "dist/server.js"]