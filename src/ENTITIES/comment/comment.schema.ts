import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ _id: false })
export class CommentatorInfo {
	@Prop()
	userId: string;

	@Prop()
	userLogin: string;
}
//export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema({ _id: false })
export class LikesInfo {
	@Prop()
	dislikesCount: number;

	@Prop()
	likesCount: number;

	@Prop()
	myStatus: string;
}
//export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema({ _id: false })
export class UserAsses {
	@Prop()
	userIdLike: string;

	@Prop()
	assess: string;
}
//export const UserAssesSchema = SchemaFactory.createForClass(UserAsses);

@Schema({ _id: false })
export class Comment {
	@Prop({ type: ObjectId, required: true, default: new ObjectId() })
	_id: ObjectId;

	@Prop({ required: true })
	id: string;

	@Prop({
		required: true,
		default: 'No title',
		maxlength: [5000, 'title is too long'],
	})
	content: string;

	@Prop({ type: CommentatorInfo, required: true })
	commentatorInfo: CommentatorInfo;

	@Prop({ required: true })
	postId: string;

	@Prop({ required: true, default: new Date().toISOString() })
	createdAt: string;

	@Prop({ type: LikesInfo, required: true })
	likesInfo: LikesInfo;

	@Prop([{ type: UserAsses }])
	userAssess: UserAsses[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
