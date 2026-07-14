import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';
import 'multer';

@Injectable()
export class TreesService {
	constructor(private readonly client: WeatherAiClient) {}

	async analyzeTree(file: Express.Multer.File, body?: Record<string, any>) {
		return this.client.postMultipart<Record<string, unknown>>(
			'/v1/trees/analyze',
			file,
			body,
		);
	}

	async getHistory(limit?: number, cursor?: string) {
		const params: Record<string, unknown> = {};
		if (limit !== undefined) params.limit = limit;
		if (cursor !== undefined) params.cursor = cursor;
		return this.client.get<Record<string, unknown>>('/v1/trees/history', params);
	}

	async getQuota() {
		return this.client.get<Record<string, unknown>>('/v1/trees/quota');
	}
}
