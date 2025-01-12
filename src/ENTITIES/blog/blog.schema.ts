import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ _id: false, collection: 'blog owner' })
export class BlogOwner {
	@Prop()
	userId: string;

	@Prop()
	userLogin: string;
}
//export const BlogOwnerSchema = SchemaFactory.createForClass(BlogOwner);

@Schema({ _id: false })
export class BlogBanInfo {
	@Prop({ default: false })
	isBanned: boolean;

	@Prop({ default: new Date().toISOString() })
	banDate: string;
}
//export const BlogBanInfoSchema = SchemaFactory.createForClass(BlogBanInfo);

@Schema({ _id: false })
export class UserBanInfo {
	@Prop({ default: false })
	isBanned: boolean;

	@Prop()
	banDate: Date;

	@Prop()
	banReason: string;
}
//export const UserBanInfoSchema = SchemaFactory.createForClass(UserBanInfo);

@Schema({ _id: false })
export class UsersBanInfo {
	@Prop()
	id: string;

	@Prop()
	login: string;

	@Prop({ type: UserBanInfo })
	banInfo: UserBanInfo;
}
//export const UsersBanInfoSchema = SchemaFactory.createForClass(UsersBanInfo);

@Schema({ collection: 'BLOGS' })
export class Blog {
	@Prop({ type: ObjectId, required: true, default: new ObjectId() })
	_id: ObjectId;

	@Prop({ required: true, default: '' })
	id: string;

	@Prop({
		required: true,
		default: 'No name',
		maxlength: [15, 'name is too long'],
	})
	name: string;

	@Prop({
		required: true,
		default: 'No description',
		maxlength: [500, 'description is too long'],
	})
	description: string;

	@Prop({
		required: true,
		default: 'No websiteUrl',
		maxlength: [100, 'websiteUrl is too long'],
	})
	websiteUrl: string;

	@Prop({ required: true, default: new Date().toISOString() })
	createdAt: string;

	@Prop({ required: true, default: false })
	isMembership: boolean;

	@Prop({ type: BlogOwner })
	blogOwnerInfo: BlogOwner;

	@Prop({ type: BlogBanInfo })
	banInfo: BlogBanInfo;

	@Prop([{ type: UsersBanInfo }])
	usersBanInfo: UsersBanInfo[];

	@Prop({ versionKey: true })
	__v: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
