import { OmitType } from '@nestjs/swagger';
import { WeatherQueryDto } from './weather-query.dto';

export class CurrentWeatherQueryDto extends OmitType(WeatherQueryDto, [
	'days',
] as const) {}
