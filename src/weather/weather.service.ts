import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherGeoQueryDto } from './dto/weather-geo-query.dto';
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto';

import {
	WeatherAiResponse,
	WeatherAiGeoResponse,
} from '../common/interfaces/weather-ai.interface';

@Injectable()
export class WeatherService {
	constructor(private readonly client: WeatherAiClient) {}

	async getWeather(query: WeatherQueryDto): Promise<WeatherAiResponse> {
		return this.client.get<WeatherAiResponse>(
			'/v1/weather',
			query as unknown as Record<string, unknown>,
		);
	}

	async getWeatherGeo(query: WeatherGeoQueryDto): Promise<WeatherAiGeoResponse> {
		return await this.client.get<WeatherAiGeoResponse>(
			'/v1/weather-geo',
			query as unknown as Record<string, unknown>,
		);
	}

	async getCurrent(query: CurrentWeatherQueryDto): Promise<Partial<WeatherAiResponse>> {
		return this.client.get<Partial<WeatherAiResponse>>(
			'/v1/current',
			query as unknown as Record<string, unknown>,
		);
	}
}
