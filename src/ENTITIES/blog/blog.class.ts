import { BlogBanInfoType, BlogOwnerInfoType, UsersBanInfoType } from '../../types/blog';
import { ObjectId } from 'mongodb';
import { Inject } from '@nestjs/common';
import { BlogDTO } from './dto/blogInputDTO';
import { BlogRepository } from './blog.repository';

export class Blog {
	public _id: ObjectId;
	public id: string;
	public name: string;
	public description: string;
	public websiteUrl: string;
	public createdAt: string;
	public isMembership: boolean;
	public blogOwnerInfo: BlogOwnerInfoType;
	public banInfo: BlogBanInfoType;
	public usersBanInfo: UsersBanInfoType[];
	public __v: number;

	constructor(
		@Inject(BlogRepository) private blogRepository: BlogRepository,
		id = 'no id',
		name = 'no name',
		description = 'no description',
		websiteUrl = 'no url',
		blogOwnerInfo: BlogOwnerInfoType = {
			userId: null,
			userLogin: null,
		},
		banInfo: BlogBanInfoType = { isBanned: false, banDate: null },
	) {
		this._id = new ObjectId();
		this.id = id;
		this.name = name;
		this.description = description;
		this.websiteUrl = websiteUrl;
		this.createdAt = new Date().toISOString();
		this.isMembership = false;
		this.blogOwnerInfo = blogOwnerInfo;
		this.banInfo = banInfo;
		this.usersBanInfo = [];
		this.__v = 0;
	}

	public async addAsyncParams(dto: BlogDTO, blogOwnerInfo: BlogOwnerInfoType) {
		const blogId = await this.blogRepository.createBlogId();
		return new Blog(this.blogRepository, blogId, dto.name, dto.description, dto.websiteUrl, blogOwnerInfo);
	}
}
