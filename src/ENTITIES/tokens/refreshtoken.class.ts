import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

//AccessTokensPayload
export class AccessTokensPayloadType {
	loginOrEmail: string;
	sub: string;
	expiresIn: string;
	iat: number;
	exp: number;

	constructor(loginOrEmail: string, sub: string, expiresIn: string, iat: number, exp: number) {
		this.loginOrEmail = loginOrEmail;
		this.sub = sub;
		this.expiresIn = expiresIn;
		this.iat = iat;
		this.exp = exp;
	}
}

//RefreshTokensPayload
export class RefreshTokensPayloadType {
	userId: string;
	login: string;
	email: string;
	deviceId: string;
	expiresIn: string;
	iat: number;
	exp: number;

	constructor(userId: string, login: string, email: string, deviceId: string, expiresIn: string, iat: number, exp: number) {
		this.userId = userId;
		this.login = login;
		this.email = email;
		this.deviceId = deviceId;
		this.expiresIn = expiresIn;
		this.iat = iat;
		this.exp = exp;
	}
}

export class RefreshToken {
	public _id: ObjectId;
	public createdAt: string;
	public expiredAt: string;
	public __v: number;

	constructor(
		public value: string,
		public userId: string,
		public deviceId: string,
		public deviceName: string,
		public IP: string,
		@Inject(ConfigService) protected configService: ConfigService,
	) {
		this._id = new ObjectId();
		this.value = value;
		this.userId = userId;
		this.deviceId = deviceId;
		this.deviceName = deviceName;
		this.IP = IP;
		this.createdAt = new Date().toISOString();
		this.expiredAt = new Date(
			new Date().getTime() + parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME')) * 1000,
		).toISOString();
		this.__v = 0;
	}
}
