import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class TreeAnalysisDto {
	@ApiPropertyOptional({ description: 'County or region' })
	@IsOptional()
	@IsString()
	county?: string;

	@ApiPropertyOptional({ description: 'Plot size in acres', type: 'string' })
	@IsOptional()
	@IsNumberString()
	landAcres?: string;

	@ApiPropertyOptional({
		description: 'Human-readable farm name or GPS description',
	})
	@IsOptional()
	@IsString()
	location?: string;

	@ApiPropertyOptional({
		description: 'Extra context for Gemini (e.g., Tea plantation)',
	})
	@IsOptional()
	@IsString()
	notes?: string;
}
