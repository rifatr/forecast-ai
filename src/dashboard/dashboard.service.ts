import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { AccountService } from '../account/account.service';
import { TreesService } from '../trees/trees.service';
import { WeatherGeoQueryDto } from '../weather/dto/weather-geo-query.dto';

@Injectable()
export class DashboardService {
	constructor(
		private readonly weatherService: WeatherService,
		private readonly accountService: AccountService,
		private readonly treesService: TreesService,
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
			this.treesService.getQuota(),
		]);

		const extract = <T>(
			res: PromiseSettledResult<T>,
			defaultMsg: string,
		): T | { error: string } =>
			res.status === 'fulfilled'
				? res.value
				: { error: (res.reason as Error)?.message ?? defaultMsg };

		const weatherPayload = extract(
			weatherRes,
			'Failed to load weather',
		);

		let weather = { error: 'Failed to load weather' };
		let geo = { error: 'Failed to geological data' };

		if ('current' in weatherPayload && 'geo' in weatherPayload) {
			// weatherPayload is WeatherAiGeoResponse
			const { geo: geoData, ...weatherData } = weatherPayload as any;
			weather = weatherData;
			geo = geoData;
		} else if ('error' in weatherPayload) {
			weather = { error: (weatherPayload as { error: string }).error };
			geo = { error: (weatherPayload as { error: string }).error };
		}

		return {
			weather,
			geo,
			usage: extract(usageRes, 'Failed to load usage'),
			treesQuota: extract(treesQuotaRes, 'Trees quota unavailable'),
		};
	}
}
