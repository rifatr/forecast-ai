# --- Base Node ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS runner
WORKDIR /app

# Set node env
ENV NODE_ENV=production

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
