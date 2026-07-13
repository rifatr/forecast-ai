import { Module } from '@nestjs/common';
import {
	ConfigModule as NestConfigModule,
	ConfigService,
} from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { WeatherModule } from './weather/weather.module';
import { AccountModule } from './account/account.module';

@Module({
	imports: [
		ConfigModule,
		CommonModule,
		HealthModule,
		WeatherModule,
		AccountModule,
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [NestConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				store: await redisStore({
					url: configService.get<string>(
						'REDIS_URL',
						'redis://localhost:6379',
					),
				}),
			}),
		}),
		ThrottlerModule.forRootAsync({
			imports: [NestConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				throttlers: [
					{
						ttl: config.get<number>('THROTTLE_TTL', 60000),
						limit: config.get<number>('THROTTLE_LIMIT', 20),
					},
				],
				storage: new ThrottlerStorageRedisService(
					config.get<string>('REDIS_URL', 'redis://localhost:6379'),
				),
			}),
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
