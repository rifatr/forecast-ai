1. `GET /v1/weather` -
```json
{
  "lat": -1.2921,
  "lon": 36.8219,
  "units": "metric",
  "days": 3,
  "current": {
    "time": "2026-07-14T18:45",
    "interval": 900,
    "temperature": 21.1,
    "windspeed": 9.3,
    "winddirection": 81,
    "is_day": 0,
    "weathercode": 1
  },
  "daily": [
    {
      "date": "2026-07-14",
      "temp_max": 25.1,
      "temp_min": 12.3,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "date": "2026-07-15",
      "temp_max": 25.9,
      "temp_min": 15.4,
      "precipitation": 0.2,
      "weathercode": 51
    },
    {
      "date": "2026-07-16",
      "temp_max": 25.8,
      "temp_min": 13.1,
      "precipitation": 0,
      "weathercode": 3
    }
  ],
  "hourly": [
    {
      "time": "2026-07-14T00:00",
      "temp": 15.1,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T01:00",
      "temp": 14.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T02:00",
      "temp": 13.6,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T03:00",
      "temp": 13.4,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T04:00",
      "temp": 12.9,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T05:00",
      "temp": 12.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T06:00",
      "temp": 12.3,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T07:00",
      "temp": 12.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T08:00",
      "temp": 14.8,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T09:00",
      "temp": 16.6,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T10:00",
      "temp": 18.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T11:00",
      "temp": 20.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T12:00",
      "temp": 22.3,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T13:00",
      "temp": 23.8,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T14:00",
      "temp": 25,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T15:00",
      "temp": 25.1,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T16:00",
      "temp": 24.4,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T17:00",
      "temp": 23.9,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T18:00",
      "temp": 22.5,
      "precipitation": 0,
      "weathercode": 1
    },
    {
      "time": "2026-07-14T19:00",
      "temp": 20.7,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T20:00",
      "temp": 19.7,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T21:00",
      "temp": 18.8,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T22:00",
      "temp": 17.9,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T23:00",
      "temp": 16.7,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-15T00:00",
      "temp": 15.7,
      "precipitation": 0,
      "weathercode": 1
    },
    {
      "time": "2026-07-15T01:00",
      "temp": 15.5,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-15T02:00",
      "temp": 15.7,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T03:00",
      "temp": 15.6,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T04:00",
      "temp": 15.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T05:00",
      "temp": 15.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T06:00",
      "temp": 15.4,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T07:00",
      "temp": 15.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T08:00",
      "temp": 16.1,
      "precipitation": 0.1,
      "weathercode": 51
    },
    {
      "time": "2026-07-15T09:00",
      "temp": 17.2,
      "precipitation": 0.1,
      "weathercode": 51
    },
    {
      "time": "2026-07-15T10:00",
      "temp": 18.6,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T11:00",
      "temp": 20.2,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T12:00",
      "temp": 21.7,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T13:00",
      "temp": 23.2,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T14:00",
      "temp": 24.6,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T15:00",
      "temp": 25.4,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T16:00",
      "temp": 25.9,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T17:00",
      "temp": 25,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T18:00",
      "temp": 22.8,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T19:00",
      "temp": 21.1,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T20:00",
      "temp": 20.4,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T21:00",
      "temp": 19.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-15T22:00",
      "temp": 18.8,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-15T23:00",
      "temp": 17.8,
      "precipitation": 0,
      "weathercode": 2
    }
  ],
  "ai_summary": null
}
```

2. `GET /v1/weather-geo` -

```json
{
  "lat": -1.2921,
  "lon": 36.8219,
  "units": "metric",
  "days": 1,
  "current": {
    "time": "2026-07-14T18:45",
    "interval": 900,
    "temperature": 21.1,
    "windspeed": 9.3,
    "winddirection": 81,
    "is_day": 0,
    "weathercode": 1
  },
  "daily": [
    {
      "date": "2026-07-14",
      "temp_max": 25.1,
      "temp_min": 12.3,
      "precipitation": 0,
      "weathercode": 3
    }
  ],
  "hourly": [
    {
      "time": "2026-07-14T00:00",
      "temp": 15.1,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T01:00",
      "temp": 14.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T02:00",
      "temp": 13.6,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T03:00",
      "temp": 13.4,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T04:00",
      "temp": 12.9,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T05:00",
      "temp": 12.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T06:00",
      "temp": 12.3,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T07:00",
      "temp": 12.5,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T08:00",
      "temp": 14.8,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T09:00",
      "temp": 16.6,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T10:00",
      "temp": 18.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T11:00",
      "temp": 20.5,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T12:00",
      "temp": 22.3,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T13:00",
      "temp": 23.8,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T14:00",
      "temp": 25,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T15:00",
      "temp": 25.1,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T16:00",
      "temp": 24.4,
      "precipitation": 0,
      "weathercode": 3
    },
    {
      "time": "2026-07-14T17:00",
      "temp": 23.9,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T18:00",
      "temp": 22.5,
      "precipitation": 0,
      "weathercode": 1
    },
    {
      "time": "2026-07-14T19:00",
      "temp": 20.7,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T20:00",
      "temp": 19.7,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T21:00",
      "temp": 18.8,
      "precipitation": 0,
      "weathercode": 2
    },
    {
      "time": "2026-07-14T22:00",
      "temp": 17.9,
      "precipitation": 0,
      "weathercode": 0
    },
    {
      "time": "2026-07-14T23:00",
      "temp": 16.7,
      "precipitation": 0,
      "weathercode": 0
    }
  ],
  "geo": {
    "ip": "27.147.204.213",
    "ip_version": "v4",
    "lat": -1.2921,
    "lon": 36.8219,
    "city": "Nairobi",
    "region": "Nairobi County",
    "country": "KE",
    "timezone": "Africa/Nairobi",
    "isp": null,
    "asn": null,
    "is_datacenter": false
  },
  "ai_summary": null
}
```

3. `GET /v1/usage` -

```json
{
  "plan": "free",
  "used": 2,
  "limit": 1000,
  "remaining": 998,
  "unlimited": false
}
```

4. `POST /v1/trees/analyze` -

```json
{"error":"Not found."}
```

From api doc:
```json
{
  "analysis_id":           "Kx8mP2qRvTnZ",
  "timestamp":             "2026-06-01T09:15:00.000Z",
  "farmer_id":             "F-001",
  "county":                "Bomet",
  "location":              "Kapkimolwa Farm, Block C",
  "land_acres":            2.5,
  "total_tree_count":      84,
  "tree_density_per_acre": 33.6,
  "confidence_score":      0.87,
  "canopy_coverage_pct":   41.2,
  "tree_health": {
    "healthy":             68,
    "needs_care":          12,
    "needs_replacement":    4
  },
  "low_confidence":        false,
  "tree_species_guess":    "Tea (Camellia sinensis)",
  "observations": [
    "Dense canopy in northern quadrant — possible over-crowding",
    "3 trees near water source show yellowing — likely waterlogging"
  ],
  "recommendations": [
    "Consider thinning northern section to improve light penetration",
    "Improve drainage around water source trees"
  ],
  "original_image_url":    "https://storage.googleapis.com/…/original.jpg",
  "overlay_image_url":     "https://storage.googleapis.com/…/overlay.jpg",
  "cv_debug": {
    "orig_resolution": "4000x3000",
    "work_resolution": "1500x1125",
    "canopy_px":       412500,
    "peaks_detected":  91,
    "after_area_filter": 84
  }
}
```

5. `GET /v1/trees/history` -

```json
{
  "error": "Not found."
}
```

6. `GET /v1/trees/quota` -

```json
{
  "error": "Not found."
}
```

From API doc:
```json
{
  "plan":      "pro",
  "used":      12,
  "limit":     100,
  "remaining": 88,
  "unlimited": false,
  "resets_at": "2026-07-01T00:00:00.000Z"
}
```