FROM oven/bun:1.2 AS base

WORKDIR /app

# ── Install ──────────────────────────────────────────────────────────────────
FROM base AS install

# Python + build tools for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy workspace root files
COPY package.json bun.lock turbo.json ./

# Copy only the packages needed for feedback-api
COPY packages/feedback-api/package.json packages/feedback-api/
COPY packages/ontology/package.json packages/ontology/

# Stub out other workspace packages so bun doesn't complain
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
COPY --from=install /app/packages/feedback-api/node_modules ./packages/feedback-api/node_modules
COPY --from=install /app/packages/ontology/node_modules ./packages/ontology/node_modules

# Copy source
COPY packages/ontology packages/ontology
COPY packages/feedback-api packages/feedback-api
COPY tsconfig.json ./

# Build ontology first (dependency), then feedback-api
RUN cd packages/ontology && npx tsc || true
RUN cd packages/feedback-api && npx tsc

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM base AS runtime

COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/packages/feedback-api/node_modules ./packages/feedback-api/node_modules
COPY --from=build /app/packages/feedback-api/dist ./packages/feedback-api/dist
COPY --from=build /app/packages/ontology/dist ./packages/ontology/dist
COPY packages/feedback-api/package.json ./packages/feedback-api/
COPY packages/ontology/package.json ./packages/ontology/

ENV FEEDBACK_API_PORT=3005
ENV FEEDBACK_DB_PATH=/app/data/feedback.db

RUN mkdir -p /app/data

EXPOSE 3005

CMD ["node", "packages/feedback-api/dist/serve.js"]
