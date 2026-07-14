import { Controller, Get, Ip, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { SmartCacheInterceptor } from '../common/smart-cache.interceptor';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Dashboard')
@Controller('v1/dashboard')
@UseInterceptors(SmartCacheInterceptor)
export class DashboardController {
	constructor(private readonly dashboardService: DashboardService) {}

	@Get()
	@CacheTTL(120000) // 2 minutes default cache
	@ApiOperation({ summary: 'Get aggregated dashboard data via auto IP geo' })
	@ApiResponse({
		status: 200,
		description: 'Combined weather, usage, and trees quota',
	})
	async getDashboardData(@Ip() ip: string) {
		return this.dashboardService.getDashboardData(ip);
	}
}
