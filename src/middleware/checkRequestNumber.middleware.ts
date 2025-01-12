import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CheckRequestNumberMiddleware implements NestMiddleware {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const path = req.originalUrl; //path of request
		const ip = req.ip || req.socket.remoteAddress || 'noIp';
		//if array of requests to current url doesn't exist -> create empty array
		const arrayOfRequests: { path: string; ip: string; iat: number }[] = (await this.cacheManager.get(path)) || [];
		const arrayOfRequestsNew = arrayOfRequests.slice(-5); // take the last five requests
		if (arrayOfRequestsNew.length >= 5 && arrayOfRequestsNew[0].iat + 10000 > Date.now()) {
			throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
		}
		console.log('take:', path, arrayOfRequestsNew);

		const writeInCache = await this.cacheManager.set(path, arrayOfRequestsNew, 0);
		next();
	}
}
