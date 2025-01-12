import { NestExpressApplication } from '@nestjs/platform-express';
import { BlackListService } from './ENTITIES/black_list/blacklist.service';

export async function preliminaryActions(app: NestExpressApplication) {
	/** some operations for creating empty black list before starting app */
	const blackListService = app.get(BlackListService);
	// await blackListService.deleteAllData();
	// await blackListService.createBlackList(); - should make it once
	await blackListService.deleteTokens();
	await blackListService.addToken("it's list of expired refresh Tokens");
}
