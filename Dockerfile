# ==========================================
# STEP 1: Builder (TypeScript compilation)
# ==========================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

# We inform pnpm and Node that we are in a CI (non-interactive) environment
ENV CI=true

COPY package.json pnpm-lock.yaml* tsconfig.json ./

# 1. We are enabling the build of bcrypt in the builder as well.
RUN echo "allowBuilds:" > pnpm-workspace.yaml && \
    echo "  bcrypt: true" >> pnpm-workspace.yaml

# 2. Now the full installation will proceed without any hitches
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ==========================================
# STEP 2: Runner (Final Production Image)
# ==========================================
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN mkdir -p /home/node/.local/share/pnpm && chown -R node:node /home/node
RUN chown -R node:node /usr/src/app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml* ./

# 3. We also copy or recreate the configuration file within the runner.
RUN echo "allowBuilds:" > pnpm-workspace.yaml && \
    echo "  bcrypt: true" >> pnpm-workspace.yaml

# 4. Clean production facility
RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]