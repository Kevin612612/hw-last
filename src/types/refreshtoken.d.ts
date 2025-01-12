import { ObjectId } from 'mongodb';

//RefreshTokens
export type RefreshTokensDataType = {
	_id: ObjectId;
	value: string;
	userId: string;
	deviceId: string;
	deviceName: string;
	IP: string;
	createdAt: string;
	expiredAt: string;
	__v: number;
};

export type RefreshTokensTypeSchema = Array<{
	ip: string;
	title: string;
	lastActiveDate: string;
	deviceId: string;
}>;

export type RefreshTokensDataTypeSchema = Array<{
	IP: string;
	deviceName: string;
	deviceId: string;
	createdAt: string;
}>;
