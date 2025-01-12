import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import mongoose from 'mongoose';
import { Comment } from './comment.class';
import { CommentViewType, CommentsTypeSchema } from '../../types/comment';
import { QueryDTO, SortDirectionEnum } from '../../dto/query.dto';
import { PostRepository } from '../post/post.repository';
import { UserRepository } from '../user/user.repository';
import { paging } from '../../secondary functions/paging';
import { BlogRepository } from '../blog/blog.repository';
import { PageParamsType } from '../../types';

//(1) getAllCommentsByPost
//(2) createComment
//(3) changeLikeStatus
//(4) updateCommentById
//(5) deleteComment
//(6.1) findCommentById

@Injectable()
export class CommentService {
	constructor(
		@Inject(CommentRepository) protected commentRepository: CommentRepository,
		@Inject(PostRepository) protected postRepository: PostRepository,
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	//(1)
	async getAllCommentsByPost(query: QueryDTO, postId: string, userId: string): Promise<CommentsTypeSchema> {
		const pageParams: PageParamsType = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: +query.pageSize || 10,
		};
		const allDataComments = await this.commentRepository.getAllCommentsByPost(postId, pageParams.sortBy, pageParams.sortDirection);
		const quantityOfDocs = await this.commentRepository.countAllCommentsByPost(postId);
		//filter allDataComments and return array that depends on which user send get request
		const sortedItems = allDataComments.map((obj) => {
			if (obj.userAssess.find((el) => el.userIdLike === userId)) {
				return {
					id: obj.id,
					content: obj.content,
					commentatorInfo: obj.commentatorInfo,
					createdAt: obj.createdAt,
					likesInfo: {
						likesCount: obj.likesInfo.likesCount,
						dislikesCount: obj.likesInfo.dislikesCount,
						myStatus: obj.userAssess.find((el) => el.userIdLike === userId)?.assess ?? 'None',
					},
				};
			} else {
				return {
					id: obj.id,
					content: obj.content,
					commentatorInfo: obj.commentatorInfo,
					createdAt: obj.createdAt,
					likesInfo: {
						likesCount: obj.likesInfo.likesCount,
						dislikesCount: obj.likesInfo.dislikesCount,
						myStatus: 'None',
					},
				};
			}
		}); //if user left comment return his assess as myStatus

		return paging(pageParams, sortedItems, quantityOfDocs);
	}

	//(2) this method creates new comment
	async newPostedCommentByPostId(
		postID: string,
		content: string,
		userId: string,
		userLogin: string,
	): Promise<CommentViewType | string[]> {
		//check if the user is not banned for blog that contains the post
		const blogId = (await this.postRepository.findPostById(postID)).blogId;
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (!!foundedBlog.usersBanInfo.find((obj) => obj.id === userId))
			throw new ForbiddenException(['you are banned by owner of this blog']);

		//create new comment
		let newComment = new Comment(this.commentRepository); //empty comment
		newComment = await newComment.addAsyncParams(content, userId, userLogin, postID); // fill user with async params
		// put this new comment into db
		try {
			const result = await this.commentRepository.newPostedComment(newComment);
		} catch (err) {
			const validationErrors = [];
			if (err instanceof mongoose.Error.ValidationError) {
				for (const path in err.errors) {
					const error = err.errors[path].message;
					validationErrors.push(error);
				}
			}
			return validationErrors;
		}
		const { _id, __v, userAssess, postId, ...viewComment } = newComment;
		return viewComment;
	}

	//(3) method change like status
	async changeLikeStatus(commentId: string, likeStatus: string, userId: string): Promise<boolean> {
		const comment = await this.commentRepository.findCommentByIdDbType(commentId);
		//change myStatus
		const result = await this.commentRepository.changeLikeStatus(commentId, likeStatus);
		//check whether this user left assess to this comment
		const userAssess = comment.userAssess.find((obj) => obj.userIdLike === userId);
		//if he didn't leave comment -> add like/dislike/none to comment
		if (!userAssess) {
			if (likeStatus == 'Like') {
				const result1 = await this.commentRepository.addLike(comment, userId);
			}
			if (likeStatus == 'Dislike') {
				const result2 = await this.commentRepository.addDislike(comment, userId);
			}
			if (likeStatus == 'None') {
				const result3 = await this.commentRepository.setNone(comment);
			}
		} else {
			const assess = userAssess.assess; //assess of this user
			if (assess == 'Like' && likeStatus == 'Like') {
				//nothing
			}
			if (assess == 'Like' && likeStatus == 'Dislike') {
				//minus like and delete user from array then add addDislike()
				const result1 = await this.commentRepository.deleteLike(comment, userId);
				const result2 = await this.commentRepository.addDislike(comment, userId);
				//set my status None
				const result3 = await this.commentRepository.setNone(comment);
			}
			if (assess == 'Like' && likeStatus == 'None') {
				//minus like and delete user from array
				const result1 = await this.commentRepository.deleteLike(comment, userId);
			}
			if (assess == 'Dislike' && likeStatus == 'Like') {
				//minus dislike and delete user from array then add addLike()
				const result1 = await this.commentRepository.deleteDislike(comment, userId);
				const result2 = await this.commentRepository.addLike(comment, userId);
				//set my status None
				const result3 = await this.commentRepository.setNone(comment);
			}
			if (assess == 'Dislike' && likeStatus == 'Dislike') {
				//nothing
			}
			if (assess == 'Dislike' && likeStatus == 'None') {
				//minus dislike and delete user from array
				const result1 = await this.commentRepository.deleteDislike(comment, userId);
			}
		}
		return true;
	}

	//(4) method updates comment by ID
	async updateCommentById(commentId: string, content: string, userId: string): Promise<boolean | string[]> {
		//check if it is your account
		const comment = await this.commentRepository.findCommentById(commentId);
		if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException(["it's not your account"]);
		try {
			const result = await this.commentRepository.updateCommentById(commentId, content);
		} catch (err) {
			const validationErrors = [];
			if (err instanceof mongoose.Error.ValidationError) {
				for (const path in err.errors) {
					const error = err.errors[path].message;
					validationErrors.push(error);
				}
			}
			return validationErrors;
		}
		return true;
	}

	//(5) method deletes comment by ID
	async deleteComment(commentId: string, userId: string): Promise<boolean> {
		//check if it is your account
		const comment = await this.commentRepository.findCommentById(commentId);
		if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException(["it's not your account"]);
		const result = await this.commentRepository.deleteComment(commentId);
		return true;
	}

	//(6) method find comment by Id
	// async findCommentById(commentId: string, user: UserDataType): Promise<CommentViewType | number> {
	//   //find comment ->  delete myStatus if user unauthorized -> return to user or 404 if not found
	//   const comment = await this.commentRepository.findCommentByIdDbType(commentId);
	//   //hide info about likes from unauthorized user
	//   if (user == null) {
	//     comment.likesInfo.myStatus = 'None';
	//   }
	//   if (user != null) {
	//     //if user authorized -> find his like/dislike in userAssess Array in comment
	//     const assess = comment.userAssess.find(obj => obj.userIdLike === user.id)?.assess ?? null;
	//     //return comment to user with his assess if this user left like or dislike
	//     if (assess) {
	//       comment.likesInfo.myStatus = assess; //like or dislike
	//     } else {
	//       comment.likesInfo.myStatus = 'None';
	//     }
	//   }
	//     const {_id, postId, __v, userAssess, ...commentView} = comment;
	//	   return commentView;
	// }

	//(6.1) method find comment by Id
	async findCommentById(commentId: string): Promise<CommentViewType | number> {
		const comment = await this.commentRepository.findCommentByIdDbType(commentId);
		//return 404 if comment's creator is banned
		const userId = comment.commentatorInfo.userId;
		const user = await this.userRepository.findUserById(userId);
		if (user.banInfo.isBanned == true) throw new NotFoundException([[`user of that comment is banned`]]);
		//hide info about likes from unauthorized user
		if (!user) {
			comment.likesInfo.myStatus = 'None';
		} else {
			const assess = comment.userAssess.find((obj) => obj.userIdLike === user.id)?.assess;
			comment.likesInfo.myStatus = assess || 'None';
		}
		//hide banned user's likes/dislikes
		for (const assess of comment.userAssess) {
			const user = await this.userRepository.findUserById(assess.userIdLike);
			if (user.banInfo.isBanned) {
				if (assess.assess === 'Like') comment.likesInfo.likesCount--;
				if (assess.assess === 'Dislike') comment.likesInfo.dislikesCount--;
			}
		}
		const { _id, postId, __v, userAssess, ...commentView } = comment;
		return commentView;
	}
}
