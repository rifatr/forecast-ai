import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { WeatherModule } from '../weather/weather.module';
import { AccountModule } from '../account/account.module';

import { TreesModule } from '../trees/trees.module';

@Module({
	imports: [WeatherModule, AccountModule, TreesModule],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
