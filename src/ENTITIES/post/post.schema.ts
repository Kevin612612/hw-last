import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ _id: false })
export class NewestLikes {
	@Prop()
	userId: string;

	@Prop()
	login: string;

	@Prop()
	addedAt: string;
}
//export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema({ _id: false })
export class ExtendedLikesInfo {
	@Prop()
	likesCount: number;

	@Prop()
	dislikesCount: number;

	@Prop()
	myStatus: string;

	@Prop([{ type: NewestLikes }])
	newestLikes: NewestLikes[];
}
//export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

enum Assess {
	Like = 'Like',
	Dislike = 'Dislike',
	None = 'None',
}

@Schema({ _id: false })
export class UserAsses {
	@Prop()
	userIdLike: string;

	@Prop({ type: String, enum: Assess, default: Assess.None }) // Use the enum and set a default value
	assess: keyof typeof Assess;
}
//export const UserAssesSchema = SchemaFactory.createForClass(UserAsses);

@Schema()
export class Post {
	@Prop({ type: ObjectId, required: true, default: new ObjectId() })
	_id: ObjectId;

	@Prop({ required: true, default: '' })
	id: string;

	@Prop({
		required: true,
		default: 'No title',
		maxlength: [30, 'title is too long'],
	})
	title: string;

	@Prop({
		required: true,
		default: 'No shortDescription',
		maxlength: [100, 'shortDescription is too long'],
	})
	shortDescription: string;

	@Prop({
		required: true,
		default: 'No content',
		maxlength: [1000, 'content is too long'],
	})
	content: string;

	@Prop({
		required: true,
		default: 'No blogId',
	})
	blogId: string;

	@Prop({
		required: true,
		default: 'No blogName',
	})
	blogName: string;

	@Prop({ required: true, default: new Date().toISOString() })
	createdAt: string;

	@Prop({ type: ExtendedLikesInfo, required: true })
	extendedLikesInfo: ExtendedLikesInfo;

	@Prop([{ type: UserAsses }])
	userAssess: UserAsses[];

	@Prop({ versionKey: true })
	__v: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
