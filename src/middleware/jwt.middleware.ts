import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
	constructor(@Inject(AuthService) protected authService: AuthService) {}

	//find user by token and put it into request
	async use(req: Request, res: Response, next: NextFunction) {
		const bearerToken = req.headers.authorization?.split(' ')[1];

		if (bearerToken) {
			try {
				const user = await this.authService.getUserByAccessToken(bearerToken);
				req.user = user;
			} catch (error) {
				// Handle token validation error, e.g., expired or invalid token
				console.log('no jwt');
			}
		}

		next();
	}
}
