import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherGeoQueryDto } from './dto/weather-geo-query.dto';
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto';

@ApiTags('Weather')
@Controller('v1')
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get('weather')
	@ApiOperation({ summary: 'Get current weather and forecast' })
	@ApiResponse({
		status: 200,
		description: 'Weather data retrieved successfully',
	})
	async getWeather(@Query() query: WeatherQueryDto) {
		return this.weatherService.getWeather(query);
	}

	@Get('weather/geo')
	@ApiOperation({ summary: 'Get weather using IP geolocation' })
	@ApiResponse({
		status: 200,
		description: 'Weather data retrieved successfully',
	})
	async getWeatherGeo(@Query() query: WeatherGeoQueryDto) {
		return this.weatherService.getWeatherGeo(query);
	}

	@Get('current')
	@ApiOperation({ summary: 'Get current weather conditions only' })
	@ApiResponse({
		status: 200,
		description: 'Current conditions retrieved successfully',
	})
	async getCurrent(@Query() query: CurrentWeatherQueryDto) {
		return this.weatherService.getCurrent(query);
	}
}
