import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccessTokenService } from '../ENTITIES/tokens/accesstoken.service';
import { UserRepository } from '../ENTITIES/user/user.repository';

@Injectable()
export class CheckAccessTokenMiddleware implements NestMiddleware {
	constructor(
		@Inject(AccessTokenService) protected accessTokenService: AccessTokenService,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization || null;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			try {
				const token = authHeader.split(' ')[1];
				//check if token valid and not expired
				const payload = await this.accessTokenService.getPayloadFromAccessToken(token);
				const isValid = await this.accessTokenService.isPayloadValid(payload);
				if (!isValid) {
					next();
				}
				const tokenExpired = await this.accessTokenService.isTokenExpired(payload);
				if (tokenExpired) {
					next();
				}
				//put user into request
				const user = await this.userRepository.findUserById(payload.sub);
				req.user = user;
				next();
			} catch (error) {
				next();
			}
		}
		next();
	}
}
