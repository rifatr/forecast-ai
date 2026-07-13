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
	WAI_PLAN: Joi.string().valid('free', 'pro', 'scale').default('free'),
	WAI_MOCK: Joi.boolean().truthy('true').falsy('false').default(false),
	WAI_BASE_URL: Joi.string().uri().default('https://api.weather-ai.co'),

	REDIS_URL: Joi.string().default('redis://localhost:6379'),

	THROTTLE_TTL: Joi.number().positive().default(60000),
	THROTTLE_LIMIT: Joi.number().positive().default(60),
});
