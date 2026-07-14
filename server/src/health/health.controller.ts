import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@Controller('health')
export class HealthController {
	@SkipThrottle()
	@Get()
	check() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
		};
	}
}
