import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherAiClient } from './weather-ai.client';

@Global()
@Module({
	imports: [HttpModule],
	providers: [WeatherAiClient],
	exports: [WeatherAiClient],
})
export class CommonModule {}
