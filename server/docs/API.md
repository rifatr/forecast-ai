# ForecastAI API reference

ForecastAI exposes a small, validated API for weather data, account usage, and Farm AI tree analysis. The server proxies the upstream WeatherAI service; clients should call this API rather than the upstream service directly.

Interactive OpenAPI documentation is available while the server is running at [http://localhost:3001/api](http://localhost:3001/api).

All endpoints below are relative to the server base URL. Weather, dashboard, and Farm AI endpoints are under `/v1`; the health check is `/health`.

## Conventions

- Query parameters are validated. Unknown query parameters and invalid values return `400 Bad Request`.
- Coordinates use decimal degrees: `lat` is latitude and `lon` is longitude.
- `units` accepts `metric` (default) or `imperial`.
- `days` accepts integers from `1` to `7` and defaults to `1`.
- `ai` is optional and defaults to `false`. Set it to `true` to request the upstream AI summary when supported.
- Frequently requested read endpoints are cached server-side; the response schema is unchanged on a cache hit.

## Weather

### `GET /v1/weather`

Returns current conditions together with the requested forecast data for explicit coordinates.

| Parameter | Required | Description |
| --- | --- | --- |
| `lat` | Yes | Latitude, for example `-1.2921`. |
| `lon` | Yes | Longitude, for example `36.8219`. |
| `days` | No | Forecast days, from `1` to `7`; default `1`. |
| `ai` | No | `true` to include an upstream AI summary; default `false`. |
| `units` | No | `metric` or `imperial`; default `metric`. |
| `lang` | No | Response language code; default `en`. |

Example:

```http
GET /v1/weather?lat=-1.2921&lon=36.8219&days=7&ai=true&units=metric&lang=en
```

### `GET /v1/weather/geo`

Returns weather using the caller's IP address for geolocation. Use `ip` to override the detected address when appropriate. Supplying `lat` and `lon` overrides the resolved coordinates.

| Parameter | Required | Description |
| --- | --- | --- |
| `ip` | No | IP address to geolocate. Defaults to the request IP. |
| `lat` | No | Explicit latitude override. Use with `lon`. |
| `lon` | No | Explicit longitude override. Use with `lat`. |
| `days` | No | Forecast days, from `1` to `7`; default `1`. |
| `ai` | No | `true` to request an AI summary; default `false`. |
| `units` | No | `metric` or `imperial`; default `metric`. |

### `GET /v1/daily`

Returns daily forecast data only. It accepts the same parameters as `GET /v1/weather`.

### `GET /v1/hourly`

Returns hourly forecast data only. It accepts the same parameters as `GET /v1/weather`.

### `GET /v1/current`

Returns current conditions only.

| Parameter | Required | Description |
| --- | --- | --- |
| `lat` | Yes | Latitude. |
| `lon` | Yes | Longitude. |
| `ai` | No | `true` to request an AI summary; default `false`. |
| `units` | No | `metric` or `imperial`; default `metric`. |
| `lang` | No | Response language code; default `en`. |

Weather responses are passed through from the upstream service. Depending on the endpoint, they include coordinate metadata, requested units, `current`, `hourly`, `daily`, and, when requested and available, `ai_summary` data.

## Dashboard and usage

### `GET /v1/dashboard`

Returns a dashboard aggregate using the request IP for location. It has no query parameters. The response combines:

- `weather` — weather data for the IP-resolved location;
- `geo` — resolved location metadata;
- `usage` — upstream Weather API plan and request usage;
- `treesQuota` — remaining Farm AI analysis quota.

The aggregate is fault-tolerant: if one dependency is unavailable, its field is returned as `{ "error": "…" }` while the other fields can still be returned successfully.

### `GET /v1/usage`

Returns WeatherAI account usage and plan details from the upstream service.

## Farm AI

### `POST /v1/trees/analyze`

Analyzes a farm image for tree count, coverage, health, observations, and recommendations.

Send `multipart/form-data` with these fields:

| Field | Required | Description |
| --- | --- | --- |
| `image` | Yes | JPEG or PNG image, maximum 10 MB. |
| `county` | No | County or region. |
| `landAcres` | No | Farm size in acres. |
| `location` | No | Human-readable farm location or GPS description. |
| `notes` | No | Optional context, such as crop type or a specific concern. |

A successful analysis can include `analysis_id`, `timestamp`, count and density metrics, `canopy_coverage_pct`, `tree_health`, confidence information, species guess, observations, recommendations, image URLs, and optional `cv_debug` processing details.

### `GET /v1/trees/history`

Returns previous Farm AI analyses. Pagination parameters are optional:

| Parameter | Required | Description |
| --- | --- | --- |
| `limit` | No | Results per page; default `20`, maximum `100`. |
| `cursor` | No | Cursor returned by a previous history response. |

### `GET /v1/trees/quota`

Returns the current Farm AI analysis quota.

## Health

### `GET /health`

Returns service health and a timestamp. This endpoint is not prefixed with `/v1`.

## Errors

Errors use a consistent envelope:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed"
  }
}
```

`RATE_LIMITED` responses can also include `error.retryAfter` in seconds.

| HTTP status | Code | Meaning |
| --- | --- | --- |
| `400` | `BAD_REQUEST` | Invalid request input, including validation and upload errors. |
| `429` | `RATE_LIMITED` | Request rate limit or upstream capacity limit reached. |
| `502` | `SERVICE_UNAVAILABLE` | The upstream service is unavailable or misconfigured. |
| `504` | `GATEWAY_TIMEOUT` | The upstream service did not respond in time. |
