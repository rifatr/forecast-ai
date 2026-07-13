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
import { QuotaService } from './quota.service';

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

			// Get base TTL from reflector (default 5 mins)
			const baseTtl =
				this.reflector.get<number>('cache_ttl', context.getHandler()) ??
				300000;

			// Fetch all adaptive config once cleanly (guaranteed to exist by Joi validation)
			const adaptiveConfig = this.configService.get<Record<string, number>>('cache.adaptive');
			if(!adaptiveConfig) {
				throw new Error('Adaptive cache configuration is missing from ConfigService!'); 
			}

			const warnT = adaptiveConfig.warningThreshold;
			const warnM = adaptiveConfig.warningMultiplier;
			const critT = adaptiveConfig.criticalThreshold;
			const critM = adaptiveConfig.criticalMultiplier;
			const emergT = adaptiveConfig.emergencyThreshold;
			const emergM = adaptiveConfig.emergencyMultiplier;

			return next.handle().pipe(
				tap((response) => {
					this.quotaService
						.getQuota()
						.then((quota) => {
							let finalTtl = baseTtl;

							if (quota && quota.limit > 0) {
								const percentage =
									(quota.remaining / quota.limit) * 100;

								const multiplier =
									percentage < emergT ? emergM :
									percentage < critT ? critM :
									percentage < warnT ? warnM :
									1;

								finalTtl = baseTtl * multiplier;
							}

							this.customCacheManager
								.set(key, response, finalTtl)
								.catch(() => { });
						})
						.catch(() => { });
				}),
			);
		} catch {
			// Fallback to handler if cache fails
			return next.handle();
		}
	}
}
