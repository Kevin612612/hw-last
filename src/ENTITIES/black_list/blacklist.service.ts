import { Inject, Injectable } from '@nestjs/common';
import { BlackListRepository } from './blacklist.repository';

/**
 * BlackListService is responsible for managing data in black list
 */

@Injectable()
export class BlackListService {
	constructor(@Inject(BlackListRepository) protected blackListRepository: BlackListRepository) {}

	/**
	 *
	 * @returns
	 */
	async deleteAllData() {
		return await this.blackListRepository.deleteAllData();
	}

	/**
	 *
	 * @returns
	 */
	async deleteTokens() {
		return await this.blackListRepository.deleteTokens();
	}

	/**
	 *
	 * @returns
	 */
	async createBlackList() {
		return await this.blackListRepository.createBlackList();
	}

	/**
	 * @param token
	 * @returns
	 */
	async addToken(token: string): Promise<boolean> {
		return await this.blackListRepository.addToken(token);
	}
}
