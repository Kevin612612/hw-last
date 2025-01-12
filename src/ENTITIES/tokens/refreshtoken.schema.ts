import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
	private configService: ConfigService;
	constructor(@Inject(ConfigService) configService: ConfigService) {
		// Calculate the default expiredAt value here
		const refreshTokenLifeTime = parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME'));
		const expirationTime = new Date(new Date().getTime() + refreshTokenLifeTime * 1000).toISOString();
		this.expiredAt = expirationTime;
	}
	@Prop({ required: true, default: '' })
	_id: ObjectId;

	@Prop({ required: true, default: '' })
	value: string;

	@Prop({ required: true, default: '' })
	userId: string;

	@Prop({ required: true, default: '' })
	deviceId: string;

	@Prop({ required: true, default: '' })
	deviceName: string;

	@Prop({ required: true, default: '' })
	IP: string;

	@Prop({ required: true, default: new Date().toISOString() })
	createdAt: string;

	@Prop({
		required: true,
	})
	expiredAt: string;

	@Prop({ versionKey: true })
	__v: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
