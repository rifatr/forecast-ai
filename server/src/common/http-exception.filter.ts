import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let code = 'INTERNAL_SERVER_ERROR';
		let message = 'An unexpected error occurred';
		let retryAfter: number | undefined = undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const res = exception.getResponse();

			if (typeof res === 'object' && res !== null) {
				const resObj = res as Record<string, unknown>;
				code =
					(resObj.code as string) ||
					(status === HttpStatus.TOO_MANY_REQUESTS
						? 'RATE_LIMITED'
						: 'BAD_REQUEST');
				message = (resObj.message as string) || exception.message;
				retryAfter = resObj.retryAfter as number | undefined;
			} else {
				message = String(res);
				if (status === HttpStatus.TOO_MANY_REQUESTS)
					code = 'RATE_LIMITED';
				else if (
					status >= HttpStatus.BAD_REQUEST &&
					status < HttpStatus.INTERNAL_SERVER_ERROR
				)
					code = 'BAD_REQUEST';
			}
		}

		const errorResponse: {
			error: { code: string; message: string; retryAfter?: number };
		} = {
			error: {
				code,
				message,
			},
		};

		if (retryAfter) {
			errorResponse.error.retryAfter = retryAfter;
		}

		response.status(status).json(errorResponse);
	}
}
