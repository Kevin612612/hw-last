import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PutRequestIntoCacheMiddleware implements NestMiddleware {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const path = req.originalUrl; //path of the request
		const ip = req.ip || req.socket.remoteAddress || 'noIp'; // ip of the request
		//if array of requests to current url doesn't exist -> create empty array
		const arrayOfRequests: { path: string; ip: string; iat: number }[] = (await this.cacheManager.get(path)) || [];
		arrayOfRequests.push({ path: path, ip: ip, iat: Date.now() });
		const writeInCache = await this.cacheManager.set(path, arrayOfRequests, 0);
		console.log('put:', path, arrayOfRequests);
		next();
	}
}
