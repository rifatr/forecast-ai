# ForecastAI API Reference

All requests must be prefixed with `/v1` unless noted otherwise.

## Endpoints

### 1. `GET /v1/dashboard`
Fetches an aggregated payload containing weather data, geological data, account usage, and trees quota. This replaces the need for clients to make 4 separate HTTP requests.

**Query Parameters:**
- `lat` (required): Latitude (e.g., `-1.2921`)
- `lon` (required): Longitude (e.g., `36.8219`)
- `days` (optional): Forecast days (default: 3)
- `units` (optional): `metric` or `imperial`

**Response (200 OK):**
```json
{
  "weather": {
    "current": { "temp": 22.4, "condition": "Sunny" },
    "forecast": [ ... ]
  },
  "geo": {
    "ip": "8.8.8.8",
    "city": "Mountain View"
  },
  "usage": {
    "requests": 150,
    "limit": 1000
  },
  "treesQuota": {
    "remaining": 80
  }
}
```

### 2. `GET /v1/weather`
Retrieves weather forecasts for a specific coordinate. Caching is enabled.

**Query Parameters:** Same as `/v1/dashboard`.

### 3. `POST /v1/trees/analyze`
Accepts a multipart form data upload containing a farm image to be analyzed for tree density and health.

**Form Data Fields:**
- `image` (File, required): The image to analyze (JPEG/PNG)
- `county` (String, optional): County or region
- `landAcres` (String, optional): Plot size in acres
- `location` (String, optional): GPS or human readable name
- `notes` (String, optional): Context for AI

### 4. `GET /v1/usage`
Returns global API key usage from the upstream WeatherAI provider.

## Error Codes

ForecastAI abstracts upstream errors to prevent leaking backend infrastructure details. 

| HTTP Status | JSON `code` | Description |
|---|---|---|
| `429` | `RATE_LIMITED` | Too many requests per minute from your IP, or backend capacity reached. |
| `502` | `SERVICE_UNAVAILABLE` | Backend is temporarily misconfigured or API token is revoked. |
| `400` | `BAD_REQUEST` | Validation error (e.g., missing latitude/longitude). |
| `504` | `GATEWAY_TIMEOUT` | Upstream service took too long to respond. |
