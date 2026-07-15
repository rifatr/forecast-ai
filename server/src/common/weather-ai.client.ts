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
	private readonly mockTrees: boolean;

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
		private readonly quotaService: QuotaService,
	) {
		this.baseUrl = this.configService.get<string>('wai.baseUrl')!;
		this.apiKey = this.configService.get<string>('wai.apiKey')!;
		this.mock = this.configService.get<boolean>('wai.mock')!;
		this.mockTrees = this.configService.get<boolean>('wai.mockTrees')!;
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
		if (this.mock || (this.mockTrees && endpoint.startsWith('/v1/trees'))) {
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
		if (this.mock || (this.mockTrees && endpoint.startsWith('/v1/trees'))) {
			return this.getMockResponse<T>(endpoint, body);
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
		if (endpoint.startsWith('/v1/weather-geo')) {
			return {
				lat: Number(params?.lat) || 0,
				lon: Number(params?.lon) || 0,
				units: 'metric',
				days: 1,
				current: { time: '2026-07-14T8:45', interval: 900, temperature: 21.1, windspeed: 9.3, winddirection: 81, is_day: 0, weathercode: 1 },
				daily: [{ date: '2026-07-14', temp_max: 25.1, temp_min: 12.3, precipitation: 0, weathercode: 3 }],
				hourly: Array.from({ length: 24 }).map((_, i) => ({
					time: `2026-07-15T${i.toString().padStart(2, '0')}:00`,
					temp: 20 + Math.random() * 5,
					precipitation: 0,
					weathercode: 3
				})),
				geo: { ip: '127.0.0.1', ip_version: 'v4', lat: Number(params?.lat) || 0, lon: Number(params?.lon) || 0, city: 'Mock City', region: 'Mock Region', country: 'MC', timezone: 'UTC', isp: null, asn: null, is_datacenter: false },
				ai_summary: "The weather is looking good. Sunny and bright",
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/weather')) {
			return {
				lat: Number(params?.lat) || 0,
				lon: Number(params?.lon) || 0,
				units: 'metric',
				days: 3,
				current: { time: '2026-07-14T18:45', interval: 900, temperature: 21.1, windspeed: 9.3, winddirection: 81, is_day: 0, weathercode: 1 },
				daily: [],
				hourly: [],
				ai_summary: null,
			} as unknown as T;
		}
		if (
			endpoint.startsWith('/v1/daily') ||
			endpoint.startsWith('/v1/hourly') ||
			endpoint.startsWith('/v1/current')
		) {
			return {
				lat: Number(params?.lat) || 0,
				lon: Number(params?.lon) || 0,
				units: 'metric',
				days: 3,
				current: { time: '2026-07-14T18:45', interval: 900, temperature: 21.1, windspeed: 9.3, winddirection: 81, is_day: 0, weathercode: 1 },
				daily: [{ date: '2026-07-14', temp_max: 25.1, temp_min: 12.3, precipitation: 0, weathercode: 3 }],
				hourly: [{ time: '2026-07-14T00:00', temp: 15.1, precipitation: 0, weathercode: 0 }],
				ai_summary: null,
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/usage')) {
			return {
				plan: 'free',
				used: 15,
				limit: 1000,
				remaining: 985,
				unlimited: false,
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/trees/quota')) {
			return {
				plan: 'pro',
				used: 12,
				limit: 100,
				remaining: 88,
				unlimited: false,
				resets_at: '2026-07-01T00:00:00.000Z',
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/trees/analyze')) {
			return {
				analysis_id: "Mock123",
				timestamp: new Date().toISOString(),
				farmer_id: params?.farmer_id || "F-MOCK",
				county: params?.county || "Bomet",
				location: params?.location || "Mock Location",
				land_acres: Number(params?.land_acres) || 2.5,
				total_tree_count: 84,
				tree_density_per_acre: 33.6,
				confidence_score: 0.87,
				canopy_coverage_pct: 41.2,
				tree_health: { healthy: 68, needs_care: 12, needs_replacement: 4 },
				low_confidence: false,
				tree_species_guess: "Tea",
				observations: ["Dense canopy"],
				recommendations: ["Thin section"],
				original_image_url: "https://mock.com/orig.jpg",
				overlay_image_url: "https://mock.com/over.jpg",
				cv_debug: { orig_resolution: "4000x3000", work_resolution: "1500x1125", canopy_px: 412500, peaks_detected: 91, after_area_filter: 84 }
			} as unknown as T;
		}
		if (endpoint.startsWith('/v1/trees/history')) {
			return {
				data: [],
				next_cursor: null,
			} as unknown as T;
		}
		return {} as T;
	}
}
