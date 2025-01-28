# base image
FROM node:18-alpine@sha256:619ce27eb37c7c0476bd518085bf1ba892e2148fc1ab5dbaff2f20c56e50444d AS base

# install dependencies
FROM base AS deps
RUN apk --no-cache add g++ gcc make python3
RUN npm i --force -g yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --link-duplicates

# build production server
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . /app/
COPY next-standalone.config.js ./next.config.js

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

RUN --mount=type=secret,id=NEXT_PUBLIC_API_HOST \
    --mount=type=secret,id=NEXT_PUBLIC_CLIENT_ID \
    --mount=type=secret,id=NEXT_PUBLIC_REDIRECT_URI \
    --mount=type=secret,id=VERSION \
    --mount=type=secret,id=COMMIT \
    export NEXT_PUBLIC_API_HOST=$(cat /run/secrets/NEXT_PUBLIC_API_HOST) && \
    export NEXT_PUBLIC_CLIENT_ID=$(cat /run/secrets/NEXT_PUBLIC_CLIENT_ID) && \
    export NEXT_PUBLIC_REDIRECT_URI=$(cat /run/secrets/NEXT_PUBLIC_REDIRECT_URI) && \
    export NEXT_PUBLIC_VERSION=$(cat /run/secrets/VERSION) && \
    export NEXT_PUBLIC_COMMIT=$(cat /run/secrets/COMMIT) && \
    yarn build

# production image
FROM base AS final
WORKDIR /app

COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

CMD [ "node", "./standalone/server.js" ]