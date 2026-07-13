import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherGeoQueryDto } from './dto/weather-geo-query.dto';
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto';

@ApiTags('Weather')
@Controller('v1')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get('weather')
	@ApiOperation({ summary: 'Get current weather and forecast' })
	@ApiResponse({
		status: 200,
		description: 'Weather data retrieved successfully',
	})
	@CacheTTL(300000) // 5 minutes
	async getWeather(@Query() query: WeatherQueryDto) {
		return this.weatherService.getWeather(query);
	}

	@Get('weather/geo')
	@ApiOperation({ summary: 'Get weather using IP geolocation' })
	@ApiResponse({
		status: 200,
		description: 'Weather data retrieved successfully',
	})
	@CacheTTL(300000) // 5 minutes
	async getWeatherGeo(@Query() query: WeatherGeoQueryDto) {
		return this.weatherService.getWeatherGeo(query);
	}

	@Get('current')
	@ApiOperation({ summary: 'Get current weather conditions only' })
	@ApiResponse({
		status: 200,
		description: 'Current conditions retrieved successfully',
	})
	@CacheTTL(120000) // 2 minutes
	async getCurrent(@Query() query: CurrentWeatherQueryDto) {
		return this.weatherService.getCurrent(query);
	}
}
