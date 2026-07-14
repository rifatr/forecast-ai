import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherAiClient } from './weather-ai.client';

import { QuotaService } from './quota.service';
import { SmartCacheInterceptor } from './smart-cache.interceptor';

@Global()
@Module({
	imports: [HttpModule],
	providers: [WeatherAiClient, QuotaService, SmartCacheInterceptor],
	exports: [WeatherAiClient, QuotaService, SmartCacheInterceptor],
})
export class CommonModule {}
