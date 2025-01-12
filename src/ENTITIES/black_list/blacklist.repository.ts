import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackListDocument } from './blacklist.schema';
import { BlackList } from './blacklist.class';
import { BlackListType } from '../../types/blacklist';

/**
 * BlackListRepository is responsible for interacting with DB
 * (0)   deleteAllData
 * (1)   deleteTokens
 * (2)   createObject
 * (3)   addToken
 * (4)   findToken
 */

@Injectable()
export class BlackListRepository {
	constructor(@InjectModel('BlackList') private blacklistModel: Model<BlackListDocument>) {}

	/**
	 * (0) delete all data
	 * @returns
	 */
	async deleteAllData(): Promise<boolean> {
		const result = await this.blacklistModel.deleteMany({});
		return result.acknowledged;
	}

	/**
	 * (1) delete tokens
	 * @returns
	 */
	async deleteTokens(): Promise<boolean> {
		const result = await this.blacklistModel.updateOne(
			{},
			{
				$set: {
					refreshTokens: [],
				},
			},
		);
		return result.acknowledged;
	}

	/**
	 * (2) method creates object BlackList
	 * @returns
	 */
	async createBlackList(): Promise<unknown> {
		const blackListObject: BlackListType = new BlackList();
		const createdBlackList = new this.blacklistModel(blackListObject);
		return await createdBlackList.save();
	}

	/**
	 * (3) add token into black list
	 * @param token
	 * @returns
	 */
	async addToken(token: string): Promise<boolean> {
		const result = await this.blacklistModel.findOneAndUpdate(
			{ __v: 0 },
			{
				$push: {
					refreshTokens: token,
				},
			},
		);
		return true;
	}

	/**
	 * (4) find token in black list
	 * @param token
	 * @returns
	 */
	async findToken(token): Promise<boolean> {
		const result = await this.blacklistModel
			.findOne({
				refreshTokens: { $elemMatch: { $regex: token } },
			})
			.exec();
		return result ? true : false;
	}
}
