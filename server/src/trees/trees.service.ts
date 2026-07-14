import { Injectable } from '@nestjs/common';
import { WeatherAiClient } from '../common/weather-ai.client';
import 'multer';

import {
	WeatherAiTreeAnalysisResponse,
	WeatherAiTreesHistoryResponse,
	WeatherAiTreesQuotaResponse,
} from '../common/interfaces/weather-ai.interface';

@Injectable()
export class TreesService {
	constructor(private readonly client: WeatherAiClient) {}

	async analyzeTree(file: Express.Multer.File, body?: Record<string, any>): Promise<WeatherAiTreeAnalysisResponse> {
		return this.client.postMultipart<WeatherAiTreeAnalysisResponse>(
			'/v1/trees/analyze',
			file,
			body,
		);
	}

	async getHistory(limit?: number, cursor?: string): Promise<WeatherAiTreesHistoryResponse> {
		const params: Record<string, unknown> = {};
		if (limit !== undefined) params.limit = limit;
		if (cursor !== undefined) params.cursor = cursor;
		return this.client.get<WeatherAiTreesHistoryResponse>('/v1/trees/history', params);
	}

	async getQuota(): Promise<WeatherAiTreesQuotaResponse> {
		return this.client.get<WeatherAiTreesQuotaResponse>('/v1/trees/quota');
	}
}
