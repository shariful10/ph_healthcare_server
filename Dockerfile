FROM node:20.19-alpine AS builder
WORKDIR /app

# Install build deps for native modules and Prisma
RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy source and build
COPY . .

# Generate Prisma client and compile TypeScript
RUN yarn prisma generate && yarn build

FROM node:20.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --ignore-scripts

# Copy compiled app, prisma client and production node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/views ./views
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

# Default command — server is started from src/server.ts -> dist/server.js
CMD ["node", "dist/server.js"]