import { CommentRepository } from './comment.repository';
import { ObjectId } from 'mongodb';
import { CommentatorInfoType, LikesInfoType, UserAssessType } from '../../types/comment';
import { Inject } from '@nestjs/common';

export class Comment {
	public _id: ObjectId;
	public id: string;
	public content: string;
	public commentatorInfo: CommentatorInfoType;
	public createdAt: string;
	public likesInfo: LikesInfoType;
	public postId: string;
	public userAssess: UserAssessType[];
	public __v: number;

	constructor(
		@Inject(CommentRepository) private commentRepository: CommentRepository,
		id = '',
		content = '',
		userId = '',
		userLogin = '',
		postId = '',
	) {
		this._id = new ObjectId();
		this.id = id;
		this.content = content;
		this.commentatorInfo = {
			userId: userId,
			userLogin: userLogin,
		};
		this.createdAt = new Date().toISOString();
		this.likesInfo = {
			dislikesCount: 0,
			likesCount: 0,
			myStatus: 'None',
		};
		this.postId = postId;
		this.userAssess = [];
		this.__v = 0;
	}

	public async addAsyncParams(content: string, userId: string, userLogin: string, postId: string) {
		const commentId = await this.commentRepository.createCommentId();
		return new Comment(this.commentRepository, commentId, content, userId, userLogin, postId);
	}
}
