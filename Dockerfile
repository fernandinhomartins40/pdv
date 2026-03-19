FROM node:20-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS build

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_DESKTOP_POSTINSTALL=1

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm db:generate
RUN pnpm --filter @pdv/types build
RUN pnpm --filter @pdv/database build
RUN pnpm --filter @pdv/api build
RUN pnpm --filter @pdv/web build

FROM base AS api-runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app /app
RUN mkdir -p /pnpm && chown -R node:node /app /pnpm

USER node

EXPOSE 3001

CMD ["pnpm", "--filter", "@pdv/api", "start"]

FROM base AS web-runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app /app
RUN mkdir -p /pnpm && chown -R node:node /app /pnpm

USER node

EXPOSE 3000

CMD ["pnpm", "--filter", "@pdv/web", "start", "--hostname", "0.0.0.0", "--port", "3000"]
