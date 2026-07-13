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
		return this.client.get(
			'/v1/weather-geo',
			query as unknown as Record<string, unknown>,
		);
	}

	async getCurrent(query: CurrentWeatherQueryDto) {
		return this.client.get(
			'/v1/current',
			query as unknown as Record<string, unknown>,
		);
	}
}
