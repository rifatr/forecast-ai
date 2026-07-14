import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherGeoQueryDto } from './dto/weather-geo-query.dto';
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto';

@Injectable()
export class WeatherService {
	constructor(private readonly client: WeatherAiClient) {}

	async getWeather(query: WeatherQueryDto) {
		return this.client.get(
			'/v1/weather',
			query as unknown as Record<string, unknown>,
		);
	}

	async getWeatherGeo(query: WeatherGeoQueryDto) {
		const { data, headers } = await this.client.getWithHeaders(
			'/v1/weather-geo',
			query as unknown as Record<string, unknown>,
		);

		const geo: Record<string, string> = {};
		if (headers) {
			if (headers['x-country']) geo['country'] = headers['x-country'] as string;
			if (headers['x-region'])  geo['region'] = headers['x-region'] as string;
			if (headers['x-city'])    geo['city'] = headers['x-city'] as string;
		}

		return { weather: data, geo };
	}

	async getCurrent(query: CurrentWeatherQueryDto) {
		return this.client.get(
			'/v1/current',
			query as unknown as Record<string, unknown>,
		);
	}
}
