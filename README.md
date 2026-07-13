# ForecastAI

NestJS proxy backend for the [WeatherAI API](https://weather-ai.co/docs). Clients call this service instead of WeatherAI directly — the API key stays server-side.

## Status

**Phase 1 complete** — NestJS scaffold, validated env config, CORS, and global validation pipe.

Upcoming: upstream WeatherAI client, health check, weather/account routes, Redis cache & rate limiting, dashboard aggregate, docs, and deployment.

See [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) for the full roadmap.

## Prerequisites

- Node.js 20+
- npm
- WeatherAI API key from [weather-ai.co](https://weather-ai.co) (optional if `WAI_MOCK=true`)

## Quick start

```bash
cp .env.example .env
# Edit .env — set WAI_API_KEY (or keep WAI_MOCK=true for offline scaffold)

npm install
npm run start:dev
```

Server listens on `http://localhost:3000` (or `PORT` from `.env`).

```bash
curl http://localhost:3000
# Hello World!
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app |
| `npm run lint` | ESLint |
| `npm test` | Unit tests |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WAI_API_KEY` | Yes* | — | WeatherAI Bearer token (`wai_...`) |
| `WAI_PLAN` | No | `free` | `free` \| `pro` \| `scale` |
| `WAI_MOCK` | No | `false` | Skip real upstream calls (fixtures coming in Phase 2) |
| `WAI_BASE_URL` | No | `https://api.weather-ai.co` | Upstream API base URL |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `PORT` | No | `3000` | HTTP port |
| `NODE_ENV` | No | `development` | `development` \| `production` \| `test` |
| `THROTTLE_TTL` | No | `60000` | Rate-limit window (ms) |
| `THROTTLE_LIMIT` | No | `60` | Max requests per window per IP |

\* Not required when `WAI_MOCK=true`.

Copy placeholders from [`.env.example`](.env.example). Never commit `.env`.

## Project structure (current)

```
forecast-ai/
├── src/
│   ├── config/           # ConfigModule + Joi env validation
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts           # CORS + ValidationPipe
├── .env.example
├── package.json
└── README.md
```

## Planned API (not implemented yet)

| Route | Purpose |
|-------|---------|
| `GET /health` | Health check |
| `GET /v1/weather` | Current + forecast proxy |
| `GET /v1/weather/geo` | Weather + geo |
| `GET /v1/current` | Current conditions |
| `GET /v1/usage` | Account usage |
| `GET /v1/dashboard` | Aggregated weather + usage + quota |

## License

Private — assignment project.
