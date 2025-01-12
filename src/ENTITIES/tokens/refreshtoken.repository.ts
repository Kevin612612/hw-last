import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenDocument } from './refreshtoken.schema';
import { Model } from 'mongoose';
import { RefreshTokensDataTypeSchema, RefreshTokensDataType } from '../../types/refreshtoken';

//(1) all devices
//(2) create token
//(3) find token by userId and deviceId
//(4) delete others
//(5) delete this
//(6) find by deviceId

@Injectable()
export class RefreshTokensRepository {
	constructor(@InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>) {}

	async createDeviceId(userId: string): Promise<string> {
		let deviceId = 1;
		while (deviceId) {
			const token = await this.refreshTokenModel.findOne({ $and: [{ deviceId: deviceId.toString() }, { userId: userId }] });
			if (!token) {
				break;
			}
			deviceId++;
		}
		return deviceId.toString();
	}

	//(0) delete all data
	async deleteAll(): Promise<boolean> {
		const result = await this.refreshTokenModel.deleteMany({});
		return result.acknowledged;
	}

	//(1) method returns structured Array
	async allActiveDevices(userId: string): Promise<RefreshTokensDataTypeSchema> {
		return await this.refreshTokenModel
			.find(
				{ $and: [{ expiredAt: { $gt: new Date().toISOString() } }, { userId: userId }] },
				{ projection: { _id: 0, value: 0, userId: 0, expiredAt: 0 } },
			)
			.lean();
	}

	//(2) method creates refreshToken
	async newCreatedToken(newToken: RefreshTokensDataType): Promise<boolean> {
		const result = await this.refreshTokenModel.insertMany(newToken);
		return true;
	}

	//(3) method finds refreshToken by userId and deviceId
	async findTokenByUserIdAndDeviceId(userId: string, deviceId: string): Promise<string | undefined> {
		const result = await this.refreshTokenModel.findOne({ userId: userId, deviceId: deviceId });
		return result?.userId ? result.userId : undefined;
	}

	//(3) method finds refreshToken by deviceId
	async findTokenByDeviceId(deviceId: string): Promise<RefreshTokensDataType | undefined> {
		return await this.refreshTokenModel.findOne({ deviceId: deviceId });
	}

	//(4) method delete all tokens by this user  except current
	async deleteOthers(userId: string, deviceId: string): Promise<boolean> {
		const result = await this.refreshTokenModel.deleteMany({ userId: userId, deviceId: { $ne: deviceId } });
		return result.acknowledged;
	}

	//(5) method delete token of this user
	async deleteOne(userId: string, deviceId: string): Promise<boolean> {
		const result = await this.refreshTokenModel.deleteOne({ userId: userId, deviceId: deviceId });
		return !!result.deletedCount;
	}

	//(6) method finds by deviceId
	async findUserByDeviceId(deviceId: string): Promise<string | undefined> {
		const result = await this.refreshTokenModel.findOne({ deviceId: deviceId });
		return result?.deviceId;
	}
}
