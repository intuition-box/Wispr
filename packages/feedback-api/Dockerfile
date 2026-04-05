FROM node:22-slim AS base

RUN npm install -g bun
WORKDIR /app

# ── Install ──────────────────────────────────────────────────────────────────
FROM base AS install

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock turbo.json ./
COPY packages/feedback-api/package.json packages/feedback-api/
COPY packages/ontology/package.json packages/ontology/

# Stub other workspace packages
RUN mkdir -p apps/chat apps/curator apps/swipe packages/agent packages/ui packages/wallet && \
    echo '{"name":"@wispr/chat","version":"0.0.1","private":true}' > apps/chat/package.json && \
    echo '{"name":"@wispr/curator","version":"0.0.1","private":true}' > apps/curator/package.json && \
    echo '{"name":"@wispr/swipe","version":"0.0.1","private":true}' > apps/swipe/package.json && \
    echo '{"name":"@wispr/agent","version":"0.0.1","private":true}' > packages/agent/package.json && \
    echo '{"name":"@wispr/ui","version":"0.0.1","private":true}' > packages/ui/package.json && \
    echo '{"name":"@wispr/wallet","version":"0.0.1","private":true}' > packages/wallet/package.json

RUN bun install

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS build

COPY --from=install /app/node_modules ./node_modules

COPY packages/ontology packages/ontology
COPY packages/feedback-api packages/feedback-api
COPY tsconfig.json ./

RUN cd packages/ontology && npx tsc || true
RUN cd packages/feedback-api && npx tsc

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS runtime

WORKDIR /app

COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app/packages/feedback-api/dist ./packages/feedback-api/dist
COPY --from=build /app/packages/ontology/dist ./packages/ontology/dist
COPY packages/feedback-api/package.json ./packages/feedback-api/
COPY packages/ontology/package.json ./packages/ontology/

ENV FEEDBACK_API_PORT=3005
ENV FEEDBACK_DB_PATH=/app/data/feedback.db

RUN mkdir -p /app/data

EXPOSE 3005

CMD ["node", "packages/feedback-api/dist/serve.js"]
