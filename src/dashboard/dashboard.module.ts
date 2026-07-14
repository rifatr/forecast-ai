import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { WeatherModule } from '../weather/weather.module';
import { AccountModule } from '../account/account.module';

@Module({
	imports: [WeatherModule, AccountModule],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
