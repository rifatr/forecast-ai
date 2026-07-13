import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.get<number>('port', 3001);

	app.enableCors({
		origin: true,
		credentials: true,
	});

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

	await app.listen(port);
}
bootstrap().catch((err) => {
	console.error('Error during bootstrap', err);
	process.exit(1);
});
