FROM node:19.5-alpine AS base


FROM base AS deps

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL=debug
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false
ENV CI=true

COPY package.json package-lock.json ./

RUN npm ci


FROM base AS builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

RUN npm prune --production


FROM base AS runner

WORKDIR /app

COPY . .

# Original Maintainer
# LABEL maintainer=willis.rh@gmail.com
LABEL maintainer=support@estuary.dev

# Original Container
# LABEL org.opencontainers.image.source=https://github.com/badsyntax/strapi-webhook-actions-proxy
LABEL org.opencontainers.image.source=https://github.com/estuary/strapi-webhook-actions-proxy

COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder --chown=node:node /app/build /app/build

ENV NODE_ENV=production

USER node

CMD ["npm", "start"]
