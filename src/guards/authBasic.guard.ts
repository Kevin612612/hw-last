import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LogClassName } from '../decorators/logger.decorator';

@Injectable()
export class AuthGuardBasic implements CanActivate {
	constructor(@Inject(JwtService) protected jwtService: JwtService) {}

	/**
	 * A guard that checks if the incoming request has the correct Basic Authorization credentials.
	 * If the credentials are valid, the request is allowed to proceed. Otherwise, an UnauthorizedException is thrown.
	 *
	 * @param context The execution context of the incoming request.
	 * @returns True if the request has valid credentials, otherwise throws an UnauthorizedException.
	 */
	@LogClassName()
	canActivate(context: ExecutionContext) {
		const request: Request = context.switchToHttp().getRequest();
		if (request.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
			throw new UnauthorizedException();
		}
		return true;
	}
}
