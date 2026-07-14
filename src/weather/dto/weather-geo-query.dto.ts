import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { WeatherQueryDto } from './weather-query.dto';

export class WeatherGeoQueryDto extends OmitType(WeatherQueryDto, [
	'lat',
	'lon',
	'lang',
] as const) {
	@ApiPropertyOptional({
		description: 'IP to resolve (pass auto to detect from request)',
		example: 'auto',
	})
	@IsOptional()
	@IsString()
	ip?: string;

	@ApiPropertyOptional({ description: 'Override detected latitude' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	lat?: number;

	@ApiPropertyOptional({ description: 'Override detected longitude' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	lon?: number;
}
