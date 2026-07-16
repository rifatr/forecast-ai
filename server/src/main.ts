import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('port', 3001);

	app.enableCors();

	// Trust the reverse proxy (Railway, Render, etc.) to securely parse X-Forwarded-For
	// This ensures @Ip() returns the real client IP instead of the load balancer's IP
	app.set('trust proxy', 1);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	const config = new DocumentBuilder()
		.setTitle('Forecast AI Server')
		.setDescription(
			'Forecast AI Backend Server with Caching and Rate Limiting',
		)
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(port);
}
bootstrap().catch((err) => {
	console.error('Error during bootstrap', err);
	process.exit(1);
});
