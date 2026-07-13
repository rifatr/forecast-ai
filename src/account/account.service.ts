import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';

@Injectable()
export class AccountService {
	constructor(private readonly client: WeatherAiClient) {}

	async getUsage() {
		return this.client.get('/v1/usage');
	}
}
