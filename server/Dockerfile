# Base stage for deps and build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["npm", "run", "start:prod"]
