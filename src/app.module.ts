import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';

@Module({
	imports: [ConfigModule, CommonModule, HealthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
