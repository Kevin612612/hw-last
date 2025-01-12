import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { getClassName } from '../secondary functions/getFunctionName';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const status = exception.getStatus();
		const request = host.switchToHttp().getRequest<Request>();
		const response = host.switchToHttp().getResponse<Response>();
		const responseBody = exception.getResponse();
		const logger = new Logger(getClassName());
		logger.log(responseBody);

		switch (status) {
			case HttpStatus.NOT_FOUND:
			case HttpStatus.FORBIDDEN:
			case HttpStatus.BAD_REQUEST:
				this.handleCommonError(response, status, responseBody);
				break;

			case HttpStatus.UNAUTHORIZED:
				response.status(status).json({ message: 'Unauthorized' });
				break;

			default:
				const result = {
					statusCode: status,
					timestamp: new Date().toISOString(),
					path: request.url,
				};
				response.status(status).json(result);
				break;
		}
	}

	private handleCommonError(response: Response, status: number, responseBody) {
		const errorResponse = { errorsMessages: [] };
		if (typeof responseBody !== 'string') {
			responseBody.message.forEach((mes: string) => {
				errorResponse.errorsMessages.push(mes);
			});
		} else {
			response.status(status).json(responseBody);
			return;
		}
		response.status(status).json(errorResponse);
	}
}
