import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { AccountService } from '../account/account.service';
import { WeatherAiClient } from '../common/weather-ai.client';
import { WeatherGeoQueryDto } from '../weather/dto/weather-geo-query.dto';

@Injectable()
export class DashboardService {
	constructor(
		private readonly weatherService: WeatherService,
		private readonly accountService: AccountService,
		private readonly weatherAiClient: WeatherAiClient,
	) {}

	async getDashboardData(ip: string) {
		const weatherQuery: WeatherGeoQueryDto = {
			ip,
			days: 1,
			ai: false,
			units: 'metric',
		};

		// Fetch geo-weather, usage, and trees quota concurrently
		const [weatherRes, usageRes, treesQuotaRes] = await Promise.allSettled([
			this.weatherService.getWeatherGeo(weatherQuery),
			this.accountService.getUsage(),
			this.weatherAiClient.get<Record<string, unknown>>(
				'/v1/trees/quota',
			),
		]);

		const extract = (
			res: PromiseSettledResult<unknown>,
			defaultMsg: string,
		) =>
			res.status === 'fulfilled'
				? res.value
				: { error: (res.reason as Error)?.message ?? defaultMsg };

		const weatherPayload = extract(
			weatherRes,
			'Failed to load weather',
		) as {
			weather?: Record<string, unknown>;
			geo?: Record<string, string>;
			error?: string;
		};

		return {
			weather: weatherPayload.weather ?? weatherPayload.error ?? { error: 'Failed to load weather' },
			geo: weatherPayload.geo ?? { error: 'Failed to geological data' },
			usage: extract(usageRes, 'Failed to load usage'),
			treesQuota: extract(treesQuotaRes, 'Trees quota unavailable'),
		};
	}
}
