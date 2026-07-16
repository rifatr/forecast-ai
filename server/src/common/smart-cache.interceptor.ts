import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Inject,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { QuotaData, QuotaService } from './quota.service';

interface AdaptiveCacheConfig {
	warningThreshold: number;
	warningMultiplier: number;
	criticalThreshold: number;
	criticalMultiplier: number;
	emergencyThreshold: number;
	emergencyMultiplier: number;
}

@Injectable()
export class SmartCacheInterceptor extends CacheInterceptor {
	@Inject(QuotaService)
	private readonly quotaService!: QuotaService;

	@Inject(ConfigService)
	private readonly configService!: ConfigService;

	@Inject(CACHE_MANAGER)
	protected readonly customCacheManager!: Cache;

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const rawKey = this.trackBy(context);
		const key = rawKey instanceof Promise ? await rawKey : rawKey;
		if (typeof key !== 'string' || !key) {
			return next.handle();
		}

		try {
			const value = await this.customCacheManager.get(key);
			if (value !== undefined && value !== null) {
				return of(value);
			}

			const baseTtl = this.reflector.get<number>('cache_ttl', context.getHandler()) ?? 300000;

			const adaptiveConfig = this.configService.get<AdaptiveCacheConfig>('cache.adaptive');
			if (!adaptiveConfig) {
				throw new Error('Adaptive cache configuration is missing from ConfigService!');
			}

			return next.handle().pipe(
				tap((response) => {
					void this.storeResponse(
						key,
						response,
						baseTtl,
						adaptiveConfig,
					);
				}),
			);
		} catch {
			return next.handle();
		}
	}

	private async storeResponse(
		key: string,
		response: unknown,
		baseTtl: number,
		config: AdaptiveCacheConfig,
	): Promise<void> {
		try {
			const quota = await this.quotaService.getQuota();
			const ttl = this.getTtl(baseTtl, quota, config);
			await this.customCacheManager.set(key, response, ttl);
		} catch {
			// Caching is best-effort and must not affect a successful response.
		}
	}

	private getTtl(
		baseTtl: number,
		quota: QuotaData | undefined,
		config: AdaptiveCacheConfig,
	): number {
		if (!quota || quota.limit <= 0) {
			return baseTtl;
		}

		const remainingPercentage = (quota.remaining / quota.limit) * 100;

		if (remainingPercentage < config.emergencyThreshold) {
			return baseTtl * config.emergencyMultiplier;
		}

		if (remainingPercentage < config.criticalThreshold) {
			return baseTtl * config.criticalMultiplier;
		}

		if (remainingPercentage < config.warningThreshold) {
			return baseTtl * config.warningMultiplier;
		}

		return baseTtl;
	}
}
