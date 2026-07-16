# ForecastAI

ForecastAI is a full-stack weather application with location-based forecasts, Farm AI image analysis, and account usage insights. It pairs a React/Vite frontend with a NestJS proxy that securely integrates with WeatherAI.

Live URL: [https://forecast-ai.rifat.app](https://forecast-ai.rifat.app)

Swagger UI: [https://forecast-ai.rifat.app/api](https://forecast-ai.rifat.app/api)

## Repository structure

```text
forecast-ai/
├── server/             # NestJS API, caching, rate limiting, and Farm AI proxy
├── web/                # React/Vite frontend
├── Dockerfile          # Builds and serves the complete application
└── docker-compose.yml  # Local Redis and containerised application
```

## Run locally

### Prerequisites

- Node.js and npm
- Docker Desktop, or Docker Engine with Docker Compose

### 1. Configure the applications

From the repository root:

```bash
cp server/.env.example server/.env
cp web/.env.example web/.env.local
```

Set a valid `WAI_API_KEY` in `server/.env`. To enable Google-powered location search, set `VITE_GOOGLE_MAPS_API_KEY` in `web/.env.local`; the [frontend guide](web/README.md#google-place-search) explains the required Google Cloud configuration.

### 2. Start Redis

```bash
docker compose up redis -d
```

The local workflow starts only Redis through Docker. The API and frontend run natively with hot reload. Use `docker compose ps` to confirm Redis is healthy.

### 3. Start the API

In a second terminal:

```bash
cd server
npm install
npm run start:dev
```

The API is available at `http://localhost:3001`.

### 4. Start the frontend

In another terminal:

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`.

## Docker deployment

The root `Dockerfile` builds the React app and NestJS API into one image. NestJS serves the compiled frontend and handles the API routes.

For a local containerised run, first configure `server/.env`, then run:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIza... docker compose up --build
```

`VITE_GOOGLE_MAPS_API_KEY` is a build-time browser key. Omit it only if Google location search is not needed. Configure `WAI_API_KEY`, `REDIS_URL`, and `NODE_ENV=production` in your hosting provider for production deployments.

## Documentation

- [Backend architecture](server/docs/ARCHITECTURE.md) — request flow, caching, quota protection, Redis, and deployment shape.
- [API reference](server/docs/API.md) — endpoint contracts, request parameters, Farm AI upload fields, and errors.
- [Postman collection](server/docs/ForecastAI.postman_collection.json) — ready-to-import API requests and variables.
- [Frontend guide](web/README.md) — frontend structure, environment variables, Google Places setup, scripts, and Docker build notes.

## License

Private project.
