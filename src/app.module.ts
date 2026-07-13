import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
