import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { AccountService } from '../account/account.service';
import { TreesService } from '../trees/trees.service';
import { WeatherGeoQueryDto } from '../weather/dto/weather-geo-query.dto';
import type {
	WeatherAiGeoData,
	WeatherAiGeoResponse,
} from '../common/interfaces/weather-ai.interface';

type DashboardError = { error: string };
type DashboardWeather = Omit<WeatherAiGeoResponse, 'geo'>;

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

		const getErrorMessage = (reason: unknown, fallback: string): string =>
			reason instanceof Error ? reason.message : fallback;

		const extract = <T>(
			res: PromiseSettledResult<T>,
			defaultMsg: string,
		): T | DashboardError =>
			res.status === 'fulfilled'
				? res.value
				: { error: getErrorMessage(res.reason, defaultMsg) };

		const weatherPayload = extract(weatherRes, 'Failed to load weather');

		let weather: DashboardWeather | DashboardError = {
			error: 'Failed to load weather',
		};
		let geo: WeatherAiGeoData | DashboardError = {
			error: 'Failed to load geolocation data',
		};

		if ('error' in weatherPayload) {
			weather = weatherPayload;
			geo = weatherPayload;
		} else {
			const { geo: geoData, ...weatherData } = weatherPayload;
			weather = weatherData;
			geo = geoData;
		}

		return {
			weather,
			geo,
			usage: extract(usageRes, 'Failed to load usage'),
			treesQuota: extract(treesQuotaRes, 'Trees quota unavailable'),
		};
	}
}
