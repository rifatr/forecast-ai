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
		const { data } = await this.getWithHeaders<T>(endpoint, params);
		return data;
	}

	async getWithHeaders<T>(
		endpoint: string,
		params?: Record<string, unknown>,
	): Promise<{ data: T; headers: Record<string, any> }> {
		if (this.mock) {
			return {
				data: this.getMockResponse<T>(endpoint, params),
				headers: {},
			};
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

			this.captureRateLimit(headers);

			return { data, headers };
		} catch (error) {
			this.handleUpstreamError(error);
		}
	}

	async postMultipart<T>(
		endpoint: string,
		file: Express.Multer.File,
		body?: Record<string, any>,
	): Promise<T> {
		if (this.mock) {
			this.logger.log(`Mocking multipart request to ${endpoint}`);
			return { analysis: 'Healthy', confidence: 0.95 } as unknown as T;
		}

		try {
			const formData = new FormData();
			const blob = new Blob([new Uint8Array(file.buffer)], {
				type: file.mimetype,
			});
			formData.append('image', blob, file.originalname);

			if (body) {
				Object.keys(body).forEach((key) => {
					if (key !== 'image' && body[key] !== undefined) {
						formData.append(key, String(body[key]));
					}
				});
			}

			const { data, headers } = await firstValueFrom(
				this.httpService
					.post<T>(`${this.baseUrl}${endpoint}`, formData, {
						headers: {
							Authorization: `Bearer ${this.apiKey}`,
							'Content-Type': 'multipart/form-data',
						},
					})
					.pipe(timeout(30000)),
			);

			this.captureRateLimit(headers);

			return data;
		} catch (error) {
			this.handleUpstreamError(error);
		}
	}

	private captureRateLimit(headers: Record<string, any>) {
		const limit = headers['x-ratelimit-limit'] as string | undefined;
		const remaining = headers['x-ratelimit-remaining'] as string | undefined;
		const resetOn = headers['x-ratelimit-reset'] as string | undefined;

		if (remaining || limit || resetOn) {
			this.logger.debug(
				`Upstream RateLimit - Limit: ${limit ?? 'N/A'}, Remaining: ${remaining ?? 'N/A'}, Reset: ${resetOn ?? 'N/A'}`,
			);

			if (limit && remaining && resetOn) {
				this.quotaService
					.updateQuota(
						parseInt(limit, 10),
						parseInt(remaining, 10),
						parseInt(resetOn, 10),
					)
					.catch((err) =>
						this.logger.error('Failed to update quota cache', err),
					);
			}
		}
	}

	private handleUpstreamError(error: unknown): never {
		if (error instanceof AxiosError) {
			const upstreamData = error.response?.data ? JSON.stringify(error.response.data) : '';
			this.logger.error(`Upstream error: ${error.message} ${upstreamData}`);
			if (error.response) {
				const status = error.response.status;
				if (status === 401 || status === 403) {
					throw new HttpException(
						{
							code: 'SERVICE_UNAVAILABLE',
							message: 'Service is temporarily misconfigured',
						},
						HttpStatus.BAD_GATEWAY,
					);
				}
				if (status === 429) {
					throw new HttpException(
						{
							code: 'RATE_LIMITED',
							message: 'Service capacity reached. Please try again later.',
							retryAfter: error.response.headers['retry-after'] || 3600,
						},
						HttpStatus.TOO_MANY_REQUESTS,
					);
				}
				// Forward status but use generic messaging
				throw new HttpException(
					{
						code: status === 400 ? 'BAD_REQUEST' : 'SERVICE_ERROR',
						message: 'An error occurred while processing your request',
					},
					status,
				);
			}
			throw new HttpException(
				{ code: 'GATEWAY_TIMEOUT', message: 'Service timeout' },
				HttpStatus.GATEWAY_TIMEOUT,
			);
		}
		this.logger.error('Internal error in WeatherAiClient', error);
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
