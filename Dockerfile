# ==========================================
# Stage 1: Build the React Web Frontend
# ==========================================
FROM node:20-alpine AS web-build
WORKDIR /app/web
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the NestJS Server
# ==========================================
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build
RUN npm prune --production

# ==========================================
# Stage 3: Production Image
# ==========================================
FROM node:20-alpine
WORKDIR /app

# Copy the server's production node_modules and built code
COPY --from=server-build /app/server/node_modules ./server/node_modules
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/package.json ./server/package.json

# Copy the built React frontend
COPY --from=web-build /app/web/dist ./web/dist

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# The execution context will be /app, so we run the server from there
CMD ["node", "server/dist/main"]
