import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDTO } from './dto/postInputDTO';
import { Post } from './post.class';
import mongoose from 'mongoose';
import { CommentRepository } from '../comment/comment.repository';
import { UserRepository } from '../user/user.repository';
import { QueryDTO, SortDirectionEnum } from '../../dto/query.dto';
import { paging } from '../../secondary functions/paging';
import { PageParamsType } from '../../types';
import { PostsTypeSchema, PostDataViewType, PostViewType } from '../../types/post';
import { UserDataType } from '../../types/users';
import { BlogRepository } from '../blog/blog.repository';

//(1) changeLikeStatus

//(4) findAll
//(5) createPost
//(6) findPostById
//(7) updatePostById
//(8) deletePost

@Injectable()
export class PostService {
	constructor(
		@Inject(PostRepository) protected postRepository: PostRepository,
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(CommentRepository) protected commentRepository: CommentRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	//(1) method changes like status
	async changeLikeStatus(postId: string, likeStatus: string, user: UserDataType): Promise<boolean> {
		//find post
		const post = await this.postRepository.findPostByIdDbType(postId);
		//change myStatus / myStatus = current assess
		const result = await this.postRepository.changeLikeStatus(postId, likeStatus);
		//check whether this user left assess to this post
		const userAssess = post.userAssess.find((obj) => obj.userIdLike === user.id);
		//if this user didn't leave like/dislike -> add like/dislike/none to post
		if (!userAssess) {
			if (likeStatus == 'Like') {
				const result1 = await this.postRepository.addLike(post, user);
			}
			if (likeStatus == 'Dislike') {
				const result2 = await this.postRepository.addDislike(post, user.id);
			}
			if (likeStatus == 'None') {
				const result3 = await this.postRepository.setNone(post);
			}
		} else {
			//assess of this user
			const assess = userAssess.assess;
			if (assess == 'Like' && likeStatus == 'Like') {
				//nothing
			}
			if (assess == 'Like' && likeStatus == 'Dislike') {
				//minus like and delete user from array then add addDislike()
				const result1 = await this.postRepository.deleteLike(post, user.id);
				const result2 = await this.postRepository.addDislike(post, user.id);
				//set my status None
				const result3 = await this.postRepository.setNone(post);
			}
			if (assess == 'Like' && likeStatus == 'None') {
				//minus like and delete user from array
				const result1 = await this.postRepository.deleteLike(post, user.id);
			}
			if (assess == 'Dislike' && likeStatus == 'Like') {
				//minus dislike and delete user from array then add addLike()
				const result1 = await this.postRepository.deleteDislike(post, user.id);
				const result2 = await this.postRepository.addLike(post, user);
				//set my status None
				const result3 = await this.postRepository.setNone(post);
			}
			if (assess == 'Dislike' && likeStatus == 'Dislike') {
				//nothing
			}
			if (assess == 'Dislike' && likeStatus == 'None') {
				//minus dislike and delete user from array
				const result1 = await this.postRepository.deleteDislike(post, user.id);
			}
		}
		return true;
	}

	//(4) this method return all posts || all posts by blogId || all posts by name || all posts by blogId and name
	async findAll(query: QueryDTO, userId: string, blogId?: string): Promise<PostsTypeSchema> {
		const pageParams: PageParamsType = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: +query.pageSize || 10,
		};

		// define filter for repository
		const filterConditions = [];
		if (pageParams.searchNameTerm) {
			filterConditions.push({ title: { $regex: pageParams.searchNameTerm, $options: 'i' } });
		}
		if (blogId) {
			filterConditions.push({ blogId: blogId });
		}
		const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

		// searching posts
		const allDataPosts = await this.postRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
		const quantityOfDocs = await this.postRepository.countAllPosts(filter);

		//transform myStatus property that depends on which user send GET-request
		const posts1: PostDataViewType[] = allDataPosts.map((post) => {
			const userAssess = post.userAssess.find((el) => el.userIdLike === userId); // find the assess of current user if it exists
			post.extendedLikesInfo.myStatus = userAssess?.assess || 'None'; // if not assess = None
			return post;
		});

		//delete property userAssess from each post - caz it's not needed anymore
		const posts2: PostViewType[] = posts1.map((post) => {
			const { userAssess, ...newItem } = post;
			return newItem;
		});

		//transform newestLikes property to display the last three ones
		const sortedItems: PostViewType[] = posts2.map((post) => {
			post.extendedLikesInfo.newestLikes = post.extendedLikesInfo.newestLikes
				.slice(-3)
				.map((obj) => {
					return {
						addedAt: obj.addedAt,
						login: obj.login,
						userId: obj.userId,
					};
				})
				.reverse();
			return post;
		});

		return paging(pageParams, sortedItems, quantityOfDocs);
	}

	//(5) method creates post with specific blogId
	async createPost(dto: PostDTO, userLogin: string): Promise<PostViewType | string[]> {
		const foundBlog = await this.blogRepository.getBlogById(dto.blogId);
		if (foundBlog.blogOwnerInfo.userLogin !== userLogin) throw new ForbiddenException([`it's not your blog`]);
		let newPost = new Post(this.postRepository, this.blogRepository); //empty post
		newPost = await newPost.addAsyncParams(dto); // fill post with async params
		// put this new post into db
		try {
			const createdPost = await this.postRepository.createPost(newPost);
			return {
				id: createdPost.id,
				title: createdPost.title,
				shortDescription: createdPost.shortDescription,
				content: createdPost.content,
				blogId: createdPost.blogId,
				blogName: createdPost.blogName,
				createdAt: createdPost.createdAt,
				extendedLikesInfo: createdPost.extendedLikesInfo,
			};
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
	}

	//(6) method returns post by ID
	async findPostById(postId: string, user: UserDataType): Promise<PostViewType | undefined> {
		//find post
		const post = await this.postRepository.findPostByIdDbType(postId);
		//check if this post belongs to banned blog
		const blog = await this.blogRepository.getBlogById(post.blogId);
		if (blog.banInfo.isBanned) return undefined;
		//hide info about likes from unauthorized user
		if (!user) {
			post.extendedLikesInfo.myStatus = 'None';
		} else {
			const assess = post.userAssess.find((obj) => obj.userIdLike === user.id)?.assess;
			post.extendedLikesInfo.myStatus = assess || 'None';
		}
		//hide banned user's likes/dislikes
		for (const assess of post.userAssess) {
			const user = await this.userRepository.findUserById(assess.userIdLike);
			if (user.banInfo.isBanned) {
				if (assess.assess === 'Like') {
					post.extendedLikesInfo.likesCount--;
					post.extendedLikesInfo.newestLikes = post.extendedLikesInfo.newestLikes.filter((obj) => obj.userId !== user.id);
				}
				if (assess.assess === 'Dislike') post.extendedLikesInfo.dislikesCount--;
			}
		}

		//delete property userAssess from post caz it's not needed anymore
		const { userAssess, ...postView } = post;

		//transform newestLikes' view
		postView.extendedLikesInfo.newestLikes = postView.extendedLikesInfo.newestLikes
			.slice(-3)
			.map((obj) => {
				return {
					addedAt: obj.addedAt,
					login: obj.login,
					userId: obj.userId,
				};
			})
			.reverse();

		//return viewModel converted from dataModel into view with 3 last assess
		return postView;
	}

	//(7) method updates post by postId
	async updatePostById(userLogin: string, postId: string, dto: PostDTO, blogId?: string): Promise<boolean | number | string[]> {
		const resultBlogId = dto.blogId || blogId; //blogId comes from either dto or from params
		const foundBlog = await this.blogRepository.getBlogById(resultBlogId);
		if (foundBlog.blogOwnerInfo.userLogin !== userLogin) throw new ForbiddenException([`it's not your blog`]);
		try {
			const result = this.postRepository.updatePostById(postId, dto, foundBlog);
			return true;
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
	}

	//(8) method deletes post by postId
	async deletePost(userLogin: string, blogId: string, postId: string): Promise<number> {
		const foundBlog = await this.blogRepository.getBlogById(blogId);
		if (foundBlog.blogOwnerInfo.userLogin !== userLogin) throw new ForbiddenException([`it's not your blog`]);
		return await this.postRepository.deletePostById(postId);
	}
}
