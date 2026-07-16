import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.number().port().default(3001),

	WAI_API_KEY: Joi.string().when('WAI_MOCK', {
		is: 'true',
		then: Joi.optional().allow(''),
		otherwise: Joi.required(),
	}),
	WAI_BASE_URL: Joi.string().uri().default('https://api.weather-ai.co'),
	WAI_PLAN: Joi.string().valid('free', 'pro', 'scale').default('free'),
	WAI_MOCK: Joi.boolean().truthy('true').falsy('false').default(false),
	WAI_MOCK_TREES: Joi.boolean().truthy('true').falsy('false').default(true),

	REDIS_URL: Joi.string().default('redis://localhost:6379'),

	THROTTLE_TTL: Joi.number().positive().default(60000),
	THROTTLE_LIMIT: Joi.number().positive().default(15),

	ADAPTIVE_CACHE_THRESHOLD_WARNING: Joi.number().positive().default(30),
	ADAPTIVE_CACHE_MULTIPLIER_WARNING: Joi.number().positive().default(12),
	ADAPTIVE_CACHE_THRESHOLD_CRITICAL: Joi.number().positive().default(10),
	ADAPTIVE_CACHE_MULTIPLIER_CRITICAL: Joi.number().positive().default(144),
	ADAPTIVE_CACHE_THRESHOLD_EMERGENCY: Joi.number().positive().default(2),
	ADAPTIVE_CACHE_MULTIPLIER_EMERGENCY: Joi.number().positive().default(288),
});
