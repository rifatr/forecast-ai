import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';
import { WeatherAiUsageResponse } from '../common/interfaces/weather-ai.interface';

@Injectable()
export class AccountService {
	constructor(private readonly client: WeatherAiClient) {}

	async getUsage(): Promise<WeatherAiUsageResponse> {
		return this.client.get<WeatherAiUsageResponse>('/v1/usage');
	}
}
