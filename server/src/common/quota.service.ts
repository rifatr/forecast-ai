import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface QuotaData {
	limit: number;
	remaining: number;
}

@Injectable()
export class QuotaService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async updateQuota(
		limit: number,
		remaining: number,
		resetTimestamp: number,
	) {
		const ttlMs = Math.max(0, resetTimestamp * 1000 - Date.now());
		if (ttlMs > 0) {
			await this.cacheManager.set(
				'upstream:quota',
				{ limit, remaining },
				ttlMs,
			);
		}
	}

	async getQuota(): Promise<QuotaData | undefined> {
		return this.cacheManager.get<QuotaData>('upstream:quota');
	}
}
