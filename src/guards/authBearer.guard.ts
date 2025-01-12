import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LogClassName } from '../decorators/logger.decorator';
import { AccessTokenService } from '../ENTITIES/tokens/accesstoken.service';
import { UserRepository } from '../ENTITIES/user/user.repository';
import { AccessTokensPayloadType } from '../ENTITIES/tokens/refreshtoken.class';

@Injectable()
export class AuthGuardBearer implements CanActivate {
	constructor(
		@Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
		@Inject(UserRepository) private userRepository: UserRepository,
	) {}

	@LogClassName()
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization || null;
		const accessToken = authHeader?.split(' ')[1] || null;
		//console.log('check accessToken', accessToken); //that string is for vercel log reading

		if (!accessToken || !authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException();
		}
		try {
			const payloadFromAccessToken = await this.validateAccessTokenAndExtractPayload(accessToken);
			request.user = await this.userRepository.findUserById(payloadFromAccessToken.sub);
			return true;
		} catch (error) {
			console.log('Error from AuthGuardBearer:', error);
			throw new UnauthorizedException();
		}
	}

	private async validateAccessTokenAndExtractPayload(accessToken: string): Promise<AccessTokensPayloadType> {
		const payload = await this.accessTokenService.getPayloadFromAccessToken(accessToken);
		/** Validation*/
		const tokenIsValid = await this.accessTokenService.isPayloadValid(payload);
		const tokenExpired = await this.accessTokenService.isTokenExpired(payload);

		if (tokenExpired || !tokenIsValid) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
