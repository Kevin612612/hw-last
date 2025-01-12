import { BaseQueryDTO, QueryDTO, SortDirectionEnum } from '../../dto/query.dto';
import { CommentRepository } from '../comment/comment.repository';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { BlogBanDTO, BlogDTO, BlogUserBanDTO } from './dto/blogInputDTO';
import { BlogDataViewTypeSA, BlogTypeSchema, BlogViewType } from '../../types/blog';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.class';
import mongoose from 'mongoose';
import { UserRepository } from '../user/user.repository';
import { RoleType } from '../../types/users';
import { paging } from '../../secondary functions/paging';
import { PostRepository } from '../post/post.repository';
import { PostViewType } from '../../types/post';
import { CommentViewType, CommentsTypeSchema } from '../../types/comment';
import { PageParamsType } from '../../types';

@Injectable()
export class BlogService {
	constructor(
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(PostRepository) protected postRepository: PostRepository,
		@Inject(CommentRepository) protected commentRepository: CommentRepository,
		@Inject(UserRepository) protected userRepository: UserRepository,
	) {}

	async findAll(query: QueryDTO, role: RoleType, userLogin?: string): Promise<BlogTypeSchema> {
		const pageParams: PageParamsType = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: +query.pageSize || 10,
		};

		// define filter
		const filterConditions = [];
		if (pageParams.searchNameTerm) filterConditions.push({ name: { $regex: pageParams.searchNameTerm, $options: 'i' } });
		if (userLogin) filterConditions.push({ 'blogOwnerInfo.userLogin': userLogin });
		const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

		// searching blogs
		const blogs = await this.blogRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
		const quantityOfDocs = await this.blogRepository.countAllBlogs(filter);

		//delete property "Secret Data" from each blog except for sisAdmin
		let blogsView: BlogDataViewTypeSA[] | BlogViewType[];
		switch (role) {
			case `sisAdmin`:
				blogsView = blogs.map((blog) => {
					const { usersBanInfo, ...newItem } = blog;
					return newItem;
				});
				break;

			case `user` || `blogger`:
				blogsView = blogs
					.filter((blog) => !blog.banInfo.isBanned)
					.map((blog) => {
						const { blogOwnerInfo, banInfo, usersBanInfo, ...newItem } = blog;
						return newItem;
					});
				break;
		}

		return paging(pageParams, blogsView, quantityOfDocs);
	}

	async createBlog(dto: BlogDTO, blogOwnerInfo): Promise<BlogViewType | string[]> {
		let newBlog = new Blog(this.blogRepository); //empty blog
		newBlog = await newBlog.addAsyncParams(dto, blogOwnerInfo);
		// put this new blog into db
		try {
			const result = await this.blogRepository.createBlog(newBlog);
			return {
				id: result.id,
				name: result.name,
				description: result.description,
				websiteUrl: result.websiteUrl,
				createdAt: result.createdAt,
				isMembership: result.isMembership,
			};
		} catch (err: unknown) {
			// throw new Exception()
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

	async getBlogById(blogId: string): Promise<BlogViewType> | undefined {
		const blog = await this.blogRepository.getBlogById(blogId);
		//if (blog.banInfo.isBanned) throw new NotFoundException([`Blog doesn't exist`]);
		if (blog.banInfo.isBanned) return undefined;
		const { blogOwnerInfo, banInfo, usersBanInfo, ...blogView } = blog;
		return blogView;
	}

	async updateBlogById(blogId: string, userId: string, blog: BlogDTO): Promise<number> {
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (foundedBlog.blogOwnerInfo.userId !== userId) throw new ForbiddenException(["it's not your blog"]);
		return await this.blogRepository.updateBlogById(blogId, blog);
	}

	async deleteBlog(blogId: string, userId: string): Promise<number> {
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (foundedBlog.blogOwnerInfo.userId !== userId) throw new ForbiddenException(["it's not your blog"]);
		return await this.blogRepository.deleteBlogById(blogId);
	}

	async bindBlogWithUser(blogId: string, userId: string) {
		const user = await this.userRepository.findUserById(userId);
		return await this.blogRepository.addOwner(blogId, user.accountData.login, user.id);
	}

	async banBlog(blogId: string, banDTO: BlogBanDTO) {
		if (banDTO.isBanned === true) {
			return await this.blogRepository.banBlog(blogId);
		} else {
			return await this.blogRepository.unbanBlog(blogId);
		}
	}

	async findAllComments(query: BaseQueryDTO, userId: string): Promise<CommentsTypeSchema> {
		const pageParams: PageParamsType = {
			sortBy: query.sortBy || 'createdAt',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			pageSize: +query.pageSize || 10,
		};
		// find all blogs
		const allBlogs = await this.blogRepository.findAll({ 'blogOwnerInfo.userId': userId }, 'createdAt', SortDirectionEnum.desc);
		// find all posts for each blog
		let allPosts: PostViewType[] = [];
		for (let i = 0; i < allBlogs.length; i++) {
			allPosts = allPosts.concat(
				await this.postRepository.findAllPostsByBlogId({ blogId: allBlogs[i].id }, 'createdAt', SortDirectionEnum.desc),
			);
		}
		// find all comments for each post
		let allComments = [];
		for (let i = 0; i < allPosts.length; i++) {
			const result = await this.commentRepository.getAllCommentsByPost(allPosts[i].id, 'createdAt', SortDirectionEnum.asc);
			//delete 'secret' properties
			const comments: CommentViewType[] = result.map((comment) => {
				const { userAssess, postId, ...newItem } = comment;
				return newItem;
			});
			//add postInfo
			const resultCommentsView = comments.map((el) => {
				el.postInfo = {
					id: allPosts[i].id,
					title: allPosts[i].title,
					blogId: allPosts[i].blogId,
					blogName: allPosts[i].blogName,
				};
			});
			allComments = allComments.concat(comments);
		}
		//sort them
		allComments.sort((a, b) => {
			const result = a[pageParams.sortBy].localeCompare(b[pageParams.sortBy]);
			return pageParams.sortDirection == SortDirectionEnum.asc ? result : -result;
		});

		return paging(pageParams, allComments, allComments.length);
	}

	async banUser(userId: string, banDTO: BlogUserBanDTO, OwnerUserId: string) {
		const foundedBlog = await this.blogRepository.getBlogById(banDTO.blogId);
		if (foundedBlog.blogOwnerInfo.userId !== OwnerUserId) throw new ForbiddenException(["it's not your blog"]);
		const userLogin = (await this.userRepository.findUserById(userId)).accountData.login;
		if (banDTO.isBanned === true) {
			return await this.blogRepository.banUser(userId, userLogin, banDTO);
		} else {
			return await this.blogRepository.unbanUser(userId, banDTO.blogId);
		}
	}

	async findAllBannedUsers(blogId: string, userId: string, query: QueryDTO): Promise<BlogTypeSchema> {
		const foundedBlog = await this.blogRepository.getBlogById(blogId);
		if (foundedBlog.blogOwnerInfo.userId !== userId) throw new ForbiddenException(["it's not your blog"]);
		const pageParams: PageParamsType = {
			sortBy: query.sortBy || 'login',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			searchNameTerm: query.searchNameTerm || '',
			pageSize: +query.pageSize || 10,
		};

		// searching blog and get property usersBanInfo
		const users = (await this.blogRepository.getBannedUsersOfBlogById(blogId)).usersBanInfo;
		console.log('pageParams.sortBy', pageParams.sortBy);

		//filter users by searchNameTerm
		const regex = new RegExp(pageParams.searchNameTerm, 'i');
		const filteredUsers = users.filter((obj) => regex.test(obj.login));

		//sort them
		const order = pageParams.sortDirection == SortDirectionEnum.asc ? 1 : -1;
		filteredUsers.sort((a, b) => (a[pageParams.sortBy] > b[pageParams.sortBy] ? order : -order));

		return paging(pageParams, filteredUsers, filteredUsers.length);
	}
}
