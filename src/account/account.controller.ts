import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountService } from './account.service';

@ApiTags('Account')
@Controller('v1')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get('usage')
	@ApiOperation({ summary: 'Get account usage statistics' })
	@ApiResponse({
		status: 200,
		description: 'Usage data retrieved successfully',
	})
	async getUsage() {
		return this.accountService.getUsage();
	}
}
