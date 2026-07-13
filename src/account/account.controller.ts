import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountService } from './account.service';

@ApiTags('Account')
@Controller('v1')
@UseInterceptors(CacheInterceptor)
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get('usage')
	@ApiOperation({ summary: 'Get account usage statistics' })
	@ApiResponse({
		status: 200,
		description: 'Usage data retrieved successfully',
	})
	@CacheTTL(120000) // 2 minutes
	async getUsage() {
		return this.accountService.getUsage();
	}
}
