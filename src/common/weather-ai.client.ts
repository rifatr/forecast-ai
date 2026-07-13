import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';
import { QuotaService } from './quota.service';

@Injectable()
export class WeatherAiClient {
	private readonly logger = new Logger(WeatherAiClient.name);
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly mock: boolean;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		private readonly quotaService: QuotaService,
	) {
		this.baseUrl = this.configService.get<string>('wai.baseUrl')!;
		this.apiKey = this.configService.get<string>('wai.apiKey')!;
		this.mock = this.configService.get<boolean>('wai.mock')!;
	}

	async get<T>(
		endpoint: string,
		params?: Record<string, unknown>,
	): Promise<T> {
		if (this.mock) {
			return this.getMockResponse<T>(endpoint, params);
		}

		try {
			const { data, headers } = await firstValueFrom(
				this.httpService
					.get<T>(`${this.baseUrl}${endpoint}`, {
						params,
						headers: {
							Authorization: `Bearer ${this.apiKey}`,
						},
					})
					.pipe(timeout(10000)),
			);

			// Capture X-RateLimit headers
			const rateLimitLimit = headers['x-ratelimit-limit'] as
				string | undefined;
			const rateLimitRemaining = headers['x-ratelimit-remaining'] as
				string | undefined;
			const rateLimitReset = headers['x-ratelimit-reset'] as
				string | undefined;

			if (rateLimitRemaining || rateLimitLimit || rateLimitReset) {
				this.logger.debug(
					`Upstream RateLimit - Limit: ${rateLimitLimit ?? 'N/A'}, Remaining: ${rateLimitRemaining ?? 'N/A'}, Reset: ${rateLimitReset ?? 'N/A'}`,
				);

				if (rateLimitLimit && rateLimitRemaining && rateLimitReset) {
					// Catch promise implicitly to not block request flow
					this.quotaService
						.updateQuota(
							parseInt(rateLimitLimit, 10),
							parseInt(rateLimitRemaining, 10),
							parseInt(rateLimitReset, 10),
						)
						.catch((err) =>
							this.logger.error(
								'Failed to update quota cache',
								err,
							),
						);
				}
			}

			return data;
		} catch (error) {
			this.handleUpstreamError(error);
		}
	}

	private handleUpstreamError(error: unknown): never {
		if (error instanceof AxiosError) {
			if (error.response) {
				const status = error.response.status;
				if (status === 401 || status === 403) {
					this.logger.error('Invalid API key or unauthorized access');
					throw new HttpException(
						{
							code: 'UPSTREAM_UNAUTHORIZED',
							message: 'Upstream unauthorized',
						},
						HttpStatus.BAD_GATEWAY,
					);
				}
				if (status === 429) {
					throw new HttpException(
						{
							code: 'RATE_LIMITED',
							message: 'Upstream quota nearly exhausted',
							retryAfter:
								(error.response.headers['retry-after'] as
									string | undefined) || 3600,
						},
						HttpStatus.TOO_MANY_REQUESTS,
					);
				}
			}
			throw new HttpException(
				{ code: 'UPSTREAM_ERROR', message: 'WeatherAI API error' },
				HttpStatus.BAD_GATEWAY,
			);
		}
		throw new HttpException(
			{ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

	private getMockResponse<T>(
		endpoint: string,
		params?: Record<string, unknown>,
	): T {
		this.logger.log(`Mocking request to ${endpoint}`);
		if (endpoint.startsWith('/v1/weather')) {
			return {
				current: { temp: 20, condition: 'Clear' },
				location: { lat: params?.lat, lon: params?.lon },
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/usage')) {
			return {
				requests: 10,
				limit: 1000,
			} as unknown as T;
		}
		return {} as T;
	}
}
