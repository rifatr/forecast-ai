import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class WeatherQueryDto {
	@ApiProperty({
		description: 'Latitude',
		example: -1.2921,
		required: true,
	})
	@Type(() => Number)
	@IsNumber()
	lat!: number;

	@ApiProperty({
		description: 'Longitude',
		example: 36.8219,
		required: true,
	})
	@Type(() => Number)
	@IsNumber()
	lon!: number;

	@ApiPropertyOptional({
		description: 'Number of days for forecast',
		minimum: 1,
		maximum: 7,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(7)
	days: number = 1;

	@ApiPropertyOptional({ description: 'Enable AI insights', default: false })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	ai: boolean = false;

	@ApiPropertyOptional({
		description: 'Units of measurement',
		default: 'metric',
		enum: ['metric', 'imperial'],
	})
	@IsOptional()
	@IsString()
	@IsIn(['metric', 'imperial'])
	units: string = 'metric';

	@ApiPropertyOptional({
		description: 'Language code for AI summary',
		default: 'en',
	})
	@IsOptional()
	@IsString()
	lang: string = 'en';
}
