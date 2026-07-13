export default () => ({
	port: parseInt(process.env.PORT ?? '3001', 10),
	nodeEnv: process.env.NODE_ENV ?? 'development',
	wai: {
		apiKey: process.env.WAI_API_KEY,
		plan: process.env.WAI_PLAN ?? 'free',
		mock: process.env.WAI_MOCK === 'true',
		baseUrl: process.env.WAI_BASE_URL ?? 'https://api.weather-ai.co',
	},
	redis: {
		url: process.env.REDIS_URL ?? 'redis://localhost:6379',
	},
	throttle: {
		ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
		limit: parseInt(process.env.THROTTLE_LIMIT ?? '15', 10),
	},
	cache: {
		adaptive: {
			warningThreshold: parseInt(
				process.env.ADAPTIVE_CACHE_THRESHOLD_WARNING ?? '30',
				10,
			),
			warningMultiplier: parseInt(
				process.env.ADAPTIVE_CACHE_MULTIPLIER_WARNING ?? '12',
				10,
			),
			criticalThreshold: parseInt(
				process.env.ADAPTIVE_CACHE_THRESHOLD_CRITICAL ?? '10',
				10,
			),
			criticalMultiplier: parseInt(
				process.env.ADAPTIVE_CACHE_MULTIPLIER_CRITICAL ?? '144',
				10,
			),
			emergencyThreshold: parseInt(
				process.env.ADAPTIVE_CACHE_THRESHOLD_EMERGENCY ?? '2',
				10,
			),
			emergencyMultiplier: parseInt(
				process.env.ADAPTIVE_CACHE_MULTIPLIER_EMERGENCY ?? '288',
				10,
			),
		},
	},
});
