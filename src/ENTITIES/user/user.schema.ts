import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserAccountData {
	@Prop({
		required: [true, 'login is required, {VALUE} is received'],
		minlength: [3, 'login is too short'],
		maxlength: [10, 'login is too long'],
	})
	login: string;

	@Prop({ required: true, default: 'No email', matches: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' })
	email: string;

	@Prop({ required: true, minlength: 10 })
	passwordSalt: string;

	@Prop({ required: [true, 'password is required'], minlength: 10 })
	passwordHash: string;

	@Prop({ default: new Date().toISOString() })
	createdAt: string;
}
//export const UserAccountDataSchema = SchemaFactory.createForClass(UserAccountData);

@Schema({ _id: false })
export class EmailConfirmation {
	@Prop()
	confirmationCode: string;

	@Prop({ default: new Date().toISOString() })
	expirationDate: string;

	@Prop({ default: false })
	isConfirmed: boolean;
}
//export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema({ _id: false })
export class Codes {
	@Prop()
	code: string;

	@Prop()
	sentAt: string;
}
//export const CodesSchema = SchemaFactory.createForClass(Codes);

@Schema({ _id: false })
export class PasswordConfirmation {
	@Prop()
	confirmationCode: string;

	@Prop({ default: new Date().toISOString() })
	expirationDate: string;

	@Prop()
	isConfirmed: boolean;
}
//export const PasswordConfirmationSchema = SchemaFactory.createForClass(PasswordConfirmation);

@Schema({ _id: false })
export class Token {
	@Prop()
	value: string;

	@Prop()
	createdAt: string;

	@Prop()
	expiredAt: string;
}
//export const TokenSchema = SchemaFactory.createForClass(Token);

@Schema({ _id: false })
export class AllToken {
	@Prop([{ type: Token }])
	accessTokens: Token[];

	@Prop([{ type: Token }])
	refreshTokens: Token[];
}
//export const AllTokenSchema = SchemaFactory.createForClass(AllToken);

@Schema({ _id: false })
export class BanInfo {
	@Prop({ default: false })
	isBanned: boolean;

	@Prop({ default: null })
	banDate: string;

	@Prop({ default: null })
	banReason: string;
}
//export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);

@Schema()
export class User {
	@Prop({ type: ObjectId, required: true, default: new ObjectId() })
	_id: ObjectId;

	@Prop({ required: true })
	id: string;

	@Prop({ type: UserAccountData, required: true })
	accountData: UserAccountData;

	@Prop({ type: EmailConfirmation, required: true })
	emailConfirmation: EmailConfirmation;

	@Prop([{ type: Codes }])
	emailCodes: Codes[];

	@Prop({ type: PasswordConfirmation, required: true })
	passwordConfirmation: PasswordConfirmation;

	@Prop([{ type: Codes }])
	passwordCodes: Codes[];

	@Prop({ type: AllToken })
	tokens: AllToken;

	@Prop({ type: BanInfo })
	banInfo: BanInfo;

	// Use versionKey option to create __v field
	@Prop({ versionKey: true })
	__v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
