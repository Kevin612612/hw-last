import { ObjectId } from 'mongodb';
import { ExtendedLikesInfoType, UserAssessType } from '../../types/post';
import { PostRepository } from './post.repository';
import { Inject } from '@nestjs/common';
import { PostDTO } from './dto/postInputDTO';
import { BlogRepository } from '../../ENTITIES/blog/blog.repository';

export class Post {
	public _id: ObjectId;
	public id: string;
	public title: string;
	public shortDescription: string;
	public content: string;
	public blogId: string;
	public blogName: string;
	public createdAt: string;
	public extendedLikesInfo: ExtendedLikesInfoType;
	public userAssess: UserAssessType[];
	public __v: number;

	constructor(
		@Inject(PostRepository) private postRepository: PostRepository,
		@Inject(BlogRepository) private blogRepository: BlogRepository,
		id = '',
		title = '',
		shortDescription = '',
		content = '',
		blogId = '',
		blogName = '',
	) {
		this._id = new ObjectId();
		this.id = id;
		this.title = title;
		this.shortDescription = shortDescription;
		this.content = content;
		this.blogId = blogId;
		this.blogName = blogName;
		this.createdAt = new Date().toISOString();
		this.extendedLikesInfo = {
			dislikesCount: 0,
			likesCount: 0,
			myStatus: 'None',
			newestLikes: [],
		};
		this.userAssess = [];
		this.__v = 0;
	}

	public async addAsyncParams(dto: PostDTO) {
		const postId = await this.postRepository.createPostId();
		const blog = await this.blogRepository.getBlogById(dto.blogId);
		const blogName = blog ? blog.name : 'no blog such ID';
		return new Post(
			this.postRepository,
			this.blogRepository,
			postId,
			dto.title,
			dto.shortDescription,
			dto.content,
			dto.blogId,
			blogName,
		);
	}
}
