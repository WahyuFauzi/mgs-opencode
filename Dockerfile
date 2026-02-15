# Stage 1 (Dependencies)
FROM oven/bun:1 AS dependencies
LABEL maintainer="OpenCode Team"
LABEL version="1.1.0"
LABEL description="Mission Manager MCP Server"
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2 (Builder)
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Note: No build step needed for TS runtime, but keeping stage structure for future

# Stage 3 (Runner)
FROM oven/bun:1 AS runner
WORKDIR /app
COPY --from=dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --from=dependencies --chown=bun:bun /app/package.json ./
COPY src ./src
COPY data ./data
RUN chown -R bun:bun /app
USER bun
ENV PORT=8765
EXPOSE 8765
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD ["bun", "run", "src/healthcheck.ts"]
CMD ["bun", "run", "start"]
