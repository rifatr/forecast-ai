export default () => ({
	port: parseInt(process.env.PORT ?? '3000', 10),
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
		limit: parseInt(process.env.THROTTLE_LIMIT ?? '60', 10),
	},
});
