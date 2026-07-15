# ForecastAI Frontend

React and Vite frontend for ForecastAI. It provides weather forecasts, Google-powered location search, Farm AI image analysis, account quota visibility, and persisted forecast/theme preferences.

For the complete application architecture, backend setup, Docker deployment, and API route reference, see the [root README](../README.md).

## Run locally

From this directory:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server runs at `http://localhost:5173` by default. The backend API should be running at `http://localhost:3001`.

## Environment variables

```env
# Required only when the frontend and API use different origins.
VITE_API_URL=http://localhost:3001

# Required for Google location suggestions.
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

`VITE_GOOGLE_MAPS_API_KEY` is a browser-exposed Google Maps key. Restrict it to your allowed website origins and to **Maps JavaScript API** and **Places API**. The root README contains the complete Google Cloud configuration checklist.

## Scripts

```bash
npm run dev      # Start Vite with hot reload
npm run build    # Type-check and create a production bundle
npm run lint     # Run Oxlint
npm run preview  # Serve the production bundle locally
```

## Frontend structure

```text
src/
  api/          # Typed calls to the NestJS /v1 endpoints
  components/   # Shared and feature-specific UI
  pages/        # Forecast, Farm AI, and Account routes
  lib/          # Google Places and weather helpers
  types/        # API response and request types
```

## Docker deployment

The root Dockerfile builds this Vite app and serves it through the NestJS container. Vite embeds `VITE_GOOGLE_MAPS_API_KEY` during the image build, so provide it as a build-time variable:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIza... docker compose up --build
```

See the [root deployment guide](../README.md#production-deployment) for production environment variables and provider setup.
